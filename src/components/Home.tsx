import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Card,
  CardContent,
  Modal,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface HomeProps {
  cartItems: {
    refrigerator: number;
    washingMachine: number;
    bulb: number;
    oven: number;
  };
  setCartItems: React.Dispatch<React.SetStateAction<{
    refrigerator: number;
    washingMachine: number;
    bulb: number;
    oven: number;
  }>>;
}

const Home: React.FC<HomeProps> = ({ cartItems, setCartItems }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentBrandIndex, setCurrentBrandIndex] = useState(0);
  const [currentRepairBrandIndex, setCurrentRepairBrandIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemCounts, setItemCounts] = useState({
    refrigerator: 0,
    washingMachine: 0,
    bulb: 0,
    oven: 0,
  });
  
  const images = [
    '/1.png',
    '/2.png', 
    '/3.png'
  ];

  const repairItems = [
    'Refrigerator',
    'Washing Machine',
    'Dishwasher',
    'Speaker',
    'Microwave',
    'Dryer',
    'Air Conditioner',
    'Water Heater',
    'TV',
    'Camera'
  ];

  const brandLogos = [
    { src: '/Samsung_Logo.svg.png', alt: 'Samsung Logo' },
    { src: '/LG-Logo.png', alt: 'LG Logo' },
    { src: '/Whirlpool-Logo.png', alt: 'Whirlpool Logo' },
    { src: '/Bosch-Logo.png', alt: 'Bosch Logo' },
    { src: '/General_Electric_logo.svg.png', alt: 'General Electric Logo' }
  ];

  // Create infinite scroll by duplicating the brands
  const infiniteBrandLogos = [...brandLogos, ...brandLogos];

  const carouselContent = [
    {
      title: "Our Premium Appliances",
      description: "Discover our collection of cutting-edge smart appliances designed to make your life easier and more efficient. From smart refrigerators to intelligent washing machines.",
      buttonText: "View Appliances",
      buttonAction: "#appliances"
    },
    {
      title: "We Can Fix What Is Broken!",
      description: "Professional repair services for all types of appliances with quick response times and guaranteed work. Our expert technicians are here to help.",
      buttonText: "Schedule Repair",
      buttonAction: "#repair"
    },
    {
      title: "Get In Touch With Us",
      description: "Ready to upgrade your home with smart appliances or need professional repair services? Contact our team today for personalized solutions.",
      buttonText: "Contact Us",
      buttonAction: "#contact"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBrandIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // Reset to 0 when we reach the end of the first set
        if (nextIndex >= brandLogos.length) {
          return 0;
        }
        return nextIndex;
      });
    }, 3000); // Change brands every 3 seconds

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRepairBrandIndex((prevIndex) => {
        const nextIndex = prevIndex + 1;
        // Reset to 0 when we reach the end of the first set
        if (nextIndex >= brandLogos.length) {
          return 0;
        }
        return nextIndex;
      });
    }, 3000); // Change repair brands every 3 seconds

    return () => clearInterval(interval);
  }, []);

  const handleScheduleClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const increaseCount = (itemType: keyof typeof itemCounts) => {
    setItemCounts(prev => ({
      ...prev,
      [itemType]: prev[itemType] + 1
    }));
  };

  const decreaseCount = (itemType: keyof typeof itemCounts) => {
    setItemCounts(prev => ({
      ...prev,
      [itemType]: Math.max(0, prev[itemType] - 1)
    }));
  };

  const addToCart = (itemType: keyof typeof itemCounts) => {
    if (itemCounts[itemType] > 0) {
      setCartItems(prev => ({
        ...prev,
        [itemType]: prev[itemType] + itemCounts[itemType]
      }));
      setItemCounts(prev => ({
        ...prev,
        [itemType]: 0
      }));
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#FFFFFF' }}>
      {/* Hero Section - Image Carousel */}
      <Box
        id="home"
        sx={{
          position: 'relative',
          height: '50vh',
          minHeight: '400px',
          overflow: 'hidden',
        }}
      >
        {/* Rotating Images */}
        {images.map((image, index) => (
          <Box
            key={index}
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
        
        {/* Overlay with Text */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(2, 47, 73, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Container maxWidth="lg" sx={{ 
            textAlign: currentImageIndex === 0 ? 'left' : currentImageIndex === 1 ? 'center' : 'right', 
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            alignItems: currentImageIndex === 0 ? 'flex-start' : currentImageIndex === 1 ? 'center' : 'flex-end',
            justifyContent: 'flex-end',
            height: '100%',
            paddingLeft: currentImageIndex === 0 ? '0' : 'inherit',
            paddingRight: currentImageIndex === 2 ? '0' : 'inherit',
            marginLeft: currentImageIndex === 0 ? '0' : 'inherit',
            marginRight: currentImageIndex === 2 ? '0' : 'inherit',
            transform: currentImageIndex === 0 ? 'translateX(-10%)' : currentImageIndex === 2 ? 'translateX(10%)' : 'none',
            paddingBottom: '2%',
          }}>
            <Typography
              variant="h1"
              sx={{
                fontFamily: 'Wasted Vindey, Arial, sans-serif',
                fontWeight: 700,
                fontSize: { xs: '2rem', md: '3rem' },
                marginBottom: 2,
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                opacity: 1,
                transition: 'opacity 0.5s ease-in-out',
              }}
            >
              {carouselContent[currentImageIndex].title}
            </Typography>
            <Typography
              variant="h5"
              sx={{
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 400,
                marginBottom: 3,
                maxWidth: currentImageIndex === 1 ? '600px' : '400px',
                margin: currentImageIndex === 0 ? '0 0 20px 0' : currentImageIndex === 1 ? '0 auto 20px auto' : '0 0 20px auto',
                textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                opacity: 1,
                transition: 'opacity 0.5s ease-in-out',
              }}
            >
              {carouselContent[currentImageIndex].description}
            </Typography>
            <Button
              variant="contained"
              size="large"
              href={carouselContent[currentImageIndex].buttonAction}
              sx={{
                backgroundColor: '#22B1FB',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 600,
                padding: '12px 32px',
                fontSize: '1.1rem',
                borderRadius: '12px',
                '&:hover': {
                  backgroundColor: '#022F49',
                },
                opacity: 1,
                transition: 'opacity 0.5s ease-in-out',
              }}
            >
              {carouselContent[currentImageIndex].buttonText}
            </Button>
          </Container>
        </Box>
      </Box>

      {/* Supported Brands Section */}
      <Box sx={{ padding: '20px 0 50px 0', backgroundColor: '#F5F7F9' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr auto 1fr' }, 
            gap: 3,
            alignItems: 'center'
          }}>
            {/* Left Side - Brands We Sell */}
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 600,
                  textAlign: 'center',
                  marginBottom: 3,
                  color: '#022F49',
                }}
              >
                Brands We Sell
              </Typography>
              
              <Box sx={{ 
                position: 'relative',
                overflow: 'hidden',
                maxWidth: '500px', 
                margin: '0 auto',
                height: '80px'
              }}>
                <Box sx={{ 
                  display: 'flex',
                  transition: 'transform 0.5s ease-in-out',
                  transform: `translateX(-${currentBrandIndex * (120 + 32)}px)`,
                  gap: 4,
                  alignItems: 'center'
                }}>
                  {infiniteBrandLogos.map((brand, index) => (
                    <Box
                      key={index}
                      component="img"
                      src={brand.src}
                      alt={brand.alt}
                      sx={{
                        width: (index % 5) === 4 ? '80px' : '120px', // GE logo is smaller
                        height: 'auto',
                        objectFit: 'contain',
                        transition: 'all 0.3s ease',
                        flexShrink: 0,
                        '&:hover': {
                          transform: 'scale(1.1)',
                          filter: 'drop-shadow(0 8px 25px rgba(0,0,0,0.2))',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>

            {/* Vertical Divider */}
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

            {/* Right Side - Brands We Repair */}
            <Box>
              <Typography
                variant="h3"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 600,
                  textAlign: 'center',
                  marginBottom: 3,
                  color: '#022F49',
                }}
              >
                Brands We Repair
              </Typography>
              
              <Box sx={{ 
                position: 'relative',
                overflow: 'hidden',
                maxWidth: '500px', 
                margin: '0 auto',
                height: '80px'
              }}>
                <Box sx={{ 
                  display: 'flex',
                  transition: 'transform 0.5s ease-in-out',
                  transform: `translateX(-${currentRepairBrandIndex * (120 + 32)}px)`,
                  gap: 4,
                  alignItems: 'center'
                }}>
                  {infiniteBrandLogos.map((brand, index) => (
                    <Box
                      key={`repair-${index}`}
                      component="img"
                      src={brand.src}
                      alt={brand.alt}
                      sx={{
                        width: (index % 5) === 4 ? '80px' : '120px', // GE logo is smaller
                        height: 'auto',
                        objectFit: 'contain',
                        transition: 'all 0.3s ease',
                        flexShrink: 0,
                        '&:hover': {
                          transform: 'scale(1.1)',
                          filter: 'drop-shadow(0 8px 25px rgba(0,0,0,0.2))',
                        }
                      }}
                    />
                  ))}
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Appliances Section */}
      <Box id="appliances" sx={{ backgroundColor: '#E8F4FD' }}>
        <Container maxWidth="lg" sx={{ padding: '40px 0 40px 0' }}>
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
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' }, gap: 4 }}>
          {/* Smart Refrigerator */}
          <Card
            sx={{
              height: '100%',
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                backgroundColor: '#022F49',
                borderColor: '#022F49',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
                '& .MuiTypography-root': {
                  color: '#FFFFFF',
                },
              },
            }}
          >
            <CardContent sx={{ padding: 3 }}>
              <Box
                component="img"
                src="/Item2.png"
                alt="Smart Refrigerator"
                sx={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  marginBottom: 2,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 600,
                  marginBottom: 2,
                  color: '#022F49',
                }}
              >
                Smart Refrigerator
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#000000',
                  lineHeight: 1.6,
                  marginBottom: 3,
                }}
              >
                Advanced temperature control, inventory tracking, and energy efficiency. Features include touch screen interface, 
                camera monitoring, and smart notifications for food expiration dates.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    fontWeight: 700,
                    color: '#022F49',
                  }}
                >
                  $1,299
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Count Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => decreaseCount('refrigerator')}
                      disabled={itemCounts.refrigerator === 0}
                      sx={{
                        minWidth: '32px',
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        border: '2px solid #22B1FB',
                        color: itemCounts.refrigerator === 0 ? '#CCCCCC' : '#22B1FB',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: itemCounts.refrigerator === 0 ? 'transparent' : '#22B1FB',
                          color: itemCounts.refrigerator === 0 ? '#CCCCCC' : '#FFFFFF',
                        },
                        '&:disabled': {
                          borderColor: '#CCCCCC',
                          color: '#CCCCCC',
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
                      {itemCounts.refrigerator}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => increaseCount('refrigerator')}
                      sx={{
                        minWidth: '32px',
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        border: '2px solid #22B1FB',
                        color: '#22B1FB',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: '#22B1FB',
                          color: '#FFFFFF',
                        },
                      }}
                    >
                      +
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => addToCart('refrigerator')}
                    disabled={itemCounts.refrigerator === 0}
                    sx={{
                      backgroundColor: itemCounts.refrigerator === 0 ? '#CCCCCC' : '#22B1FB',
                      color: '#FFFFFF',
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontWeight: 600,
                      border: '2px solid #21B2FA',
                      borderRadius: '12px',
                      '&:hover': {
                        backgroundColor: itemCounts.refrigerator === 0 ? '#CCCCCC' : '#022F49',
                        border: '2px solid #21B2FA',
                      },
                      '&:disabled': {
                        backgroundColor: '#CCCCCC',
                        borderColor: '#CCCCCC',
                      },
                    }}
                  >
                    Add To Cart
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Smart Washing Machine */}
          <Card
            sx={{
              height: '100%',
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                backgroundColor: '#022F49',
                borderColor: '#022F49',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
                '& .MuiTypography-root': {
                  color: '#FFFFFF',
                },
              },
            }}
          >
            <CardContent sx={{ padding: 3 }}>
              <Box
                component="img"
                src="/Item4.png"
                alt="Smart Washing Machine"
                sx={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  marginBottom: 2,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 600,
                  marginBottom: 2,
                  color: '#022F49',
                }}
              >
                Smart Washing Machine
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#000000',
                  lineHeight: 1.6,
                  marginBottom: 3,
                }}
              >
                AI-powered fabric detection, optimal cycle selection, and remote control via smartphone app. 
                Features include steam cleaning, allergen removal, and energy monitoring.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    fontWeight: 700,
                    color: '#022F49',
                  }}
                >
                  $899
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Count Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => decreaseCount('washingMachine')}
                      disabled={itemCounts.washingMachine === 0}
                      sx={{
                        minWidth: '32px',
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        border: '2px solid #22B1FB',
                        color: itemCounts.washingMachine === 0 ? '#CCCCCC' : '#22B1FB',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: itemCounts.washingMachine === 0 ? 'transparent' : '#22B1FB',
                          color: itemCounts.washingMachine === 0 ? '#CCCCCC' : '#FFFFFF',
                        },
                        '&:disabled': {
                          borderColor: '#CCCCCC',
                          color: '#CCCCCC',
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
                      {itemCounts.washingMachine}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => increaseCount('washingMachine')}
                      sx={{
                        minWidth: '32px',
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        border: '2px solid #22B1FB',
                        color: '#22B1FB',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: '#22B1FB',
                          color: '#FFFFFF',
                        },
                      }}
                    >
                      +
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => addToCart('washingMachine')}
                    disabled={itemCounts.washingMachine === 0}
                    sx={{
                      backgroundColor: itemCounts.washingMachine === 0 ? '#CCCCCC' : '#22B1FB',
                      color: '#FFFFFF',
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontWeight: 600,
                      border: '2px solid #21B2FA',
                      borderRadius: '12px',
                      '&:hover': {
                        backgroundColor: itemCounts.washingMachine === 0 ? '#CCCCCC' : '#022F49',
                        border: '2px solid #21B2FA',
                      },
                      '&:disabled': {
                        backgroundColor: '#CCCCCC',
                        borderColor: '#CCCCCC',
                      },
                    }}
                  >
                    Add To Cart
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Smart Dishwasher */}
          <Card
            sx={{
              height: '100%',
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                backgroundColor: '#022F49',
                borderColor: '#022F49',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
                '& .MuiTypography-root': {
                  color: '#FFFFFF',
                },
              },
            }}
          >
            <CardContent sx={{ padding: 3 }}>
              <Box
                component="img"
                src="/Item3.png"
                alt="Smart Bulb"
                sx={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  marginBottom: 2,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 600,
                  marginBottom: 2,
                  color: '#022F49',
                }}
              >
                Smart Bulb
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#000000',
                  lineHeight: 1.6,
                  marginBottom: 3,
                }}
              >
                Energy-efficient LED smart bulbs with customizable colors and brightness. Features include 
                voice control, scheduling, and remote control via smartphone app for ultimate convenience.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    fontWeight: 700,
                    color: '#022F49',
                  }}
                >
                  $49
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Count Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => decreaseCount('bulb')}
                      disabled={itemCounts.bulb === 0}
                      sx={{
                        minWidth: '32px',
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        border: '2px solid #22B1FB',
                        color: itemCounts.bulb === 0 ? '#CCCCCC' : '#22B1FB',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: itemCounts.bulb === 0 ? 'transparent' : '#22B1FB',
                          color: itemCounts.bulb === 0 ? '#CCCCCC' : '#FFFFFF',
                        },
                        '&:disabled': {
                          borderColor: '#CCCCCC',
                          color: '#CCCCCC',
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
                      {itemCounts.bulb}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => increaseCount('bulb')}
                      sx={{
                        minWidth: '32px',
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        border: '2px solid #22B1FB',
                        color: '#22B1FB',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: '#22B1FB',
                          color: '#FFFFFF',
                        },
                      }}
                    >
                      +
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => addToCart('bulb')}
                    disabled={itemCounts.bulb === 0}
                    sx={{
                      backgroundColor: itemCounts.bulb === 0 ? '#CCCCCC' : '#22B1FB',
                      color: '#FFFFFF',
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontWeight: 600,
                      border: '2px solid #21B2FA',
                      borderRadius: '12px',
                      '&:hover': {
                        backgroundColor: itemCounts.bulb === 0 ? '#CCCCCC' : '#022F49',
                        border: '2px solid #21B2FA',
                      },
                      '&:disabled': {
                        backgroundColor: '#CCCCCC',
                        borderColor: '#CCCCCC',
                      },
                    }}
                  >
                    Add To Cart
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Smart Oven */}
          <Card
            sx={{
              height: '100%',
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                backgroundColor: '#022F49',
                borderColor: '#022F49',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
                '& .MuiTypography-root': {
                  color: '#FFFFFF',
                },
              },
            }}
          >
            <CardContent sx={{ padding: 3 }}>
              <Box
                component="img"
                src="/Item1.png"
                alt="Smart Oven"
                sx={{
                  width: '100%',
                  height: '150px',
                  objectFit: 'contain',
                  borderRadius: '8px',
                  marginBottom: 2,
                }}
              />
              <Typography
                variant="h5"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 600,
                  marginBottom: 2,
                  color: '#022F49',
                }}
              >
                Smart Oven
              </Typography>
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#000000',
                  lineHeight: 1.6,
                  marginBottom: 3,
                }}
              >
                Precision cooking with built-in cameras, recipe guidance, and temperature monitoring. 
                Features include convection cooking, air frying, and voice control integration.
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 2 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    fontWeight: 700,
                    color: '#022F49',
                  }}
                >
                  $1,199
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {/* Count Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                      variant="outlined"
                      onClick={() => decreaseCount('oven')}
                      disabled={itemCounts.oven === 0}
                      sx={{
                        minWidth: '32px',
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        border: '2px solid #22B1FB',
                        color: itemCounts.oven === 0 ? '#CCCCCC' : '#22B1FB',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: itemCounts.oven === 0 ? 'transparent' : '#22B1FB',
                          color: itemCounts.oven === 0 ? '#CCCCCC' : '#FFFFFF',
                        },
                        '&:disabled': {
                          borderColor: '#CCCCCC',
                          color: '#CCCCCC',
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
                      {itemCounts.oven}
                    </Typography>
                    <Button
                      variant="outlined"
                      onClick={() => increaseCount('oven')}
                      sx={{
                        minWidth: '32px',
                        width: '32px',
                        height: '32px',
                        padding: 0,
                        border: '2px solid #22B1FB',
                        color: '#22B1FB',
                        borderRadius: '8px',
                        '&:hover': {
                          backgroundColor: '#22B1FB',
                          color: '#FFFFFF',
                        },
                      }}
                    >
                      +
                    </Button>
                  </Box>
                  <Button
                    variant="contained"
                    onClick={() => addToCart('oven')}
                    disabled={itemCounts.oven === 0}
                    sx={{
                      backgroundColor: itemCounts.oven === 0 ? '#CCCCCC' : '#22B1FB',
                      color: '#FFFFFF',
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontWeight: 600,
                      border: '2px solid #21B2FA',
                      borderRadius: '12px',
                      '&:hover': {
                        backgroundColor: itemCounts.oven === 0 ? '#CCCCCC' : '#022F49',
                        border: '2px solid #21B2FA',
                      },
                      '&:disabled': {
                        backgroundColor: '#CCCCCC',
                        borderColor: '#CCCCCC',
                      },
                    }}
                  >
                    Add To Cart
                  </Button>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Box>
        
        {/* View All Button */}
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Button
            variant="outlined"
            size="large"
            sx={{
              borderColor: '#22B1FB',
              color: '#22B1FB',
              fontFamily: 'DM Sans, Arial, sans-serif',
              fontWeight: 600,
              fontSize: '1.1rem',
              padding: '12px 32px',
              borderRadius: '12px',
              '&:hover': {
                backgroundColor: '#22B1FB',
                color: '#FFFFFF',
                borderColor: '#22B1FB',
              },
            }}
          >
            View All
          </Button>
        </Box>
        </Container>
      </Box>

              {/* Repairs Section */}
        <Box id="repair" sx={{ backgroundColor: '#F5F7F9', padding: '40px 0' }}>
        <Container maxWidth="lg">
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
          What We Fix
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 3, maxWidth: '1200px', margin: '0 auto' }}>
          {/* Refrigerator Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/Refrigerator Icon.png"
                  alt="Refrigerator Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Refrigerator
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Cooling issues, ice maker problems, temperature control
              </Typography>
            </CardContent>
          </Card>

          {/* Washing Machine Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/WashingMachine Icon.png"
                  alt="Washing Machine Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Washing Machine
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Spin cycle issues, water leaks, drainage problems
              </Typography>
            </CardContent>
          </Card>

          {/* Dishwasher Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/Dishwasher Icon.png"
                  alt="Dishwasher Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Dishwasher
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Water flow issues, cleaning problems, drainage repair
              </Typography>
            </CardContent>
          </Card>

          {/* Speaker Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/speaker.png"
                  alt="Speaker Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Speaker
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Audio distortion, connectivity issues, power problems
              </Typography>
            </CardContent>
          </Card>

          {/* Microwave Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/Oven Icon.png"
                  alt="Microwave Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Microwave
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Heating problems, door issues, control panel repair
              </Typography>
            </CardContent>
          </Card>

          {/* Dryer Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/dryer.png"
                  alt="Dryer Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Dryer
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Heating issues, drum problems, belt replacement
              </Typography>
            </CardContent>
          </Card>

          {/* Air Conditioner Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/air-conditioner.png"
                  alt="Air Conditioner Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Air Conditioner
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Cooling problems, refrigerant leaks, compressor repair
              </Typography>
            </CardContent>
          </Card>

          {/* Water Heater Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/water-heater.png"
                  alt="Water Heater Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Water Heater
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Heating element issues, thermostat problems, tank leaks
              </Typography>
            </CardContent>
          </Card>

          {/* TV Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/smart-tv.png"
                  alt="TV Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                TV
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Screen issues, smart features, connectivity problems
              </Typography>
            </CardContent>
          </Card>

          {/* Camera Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/cctv-camera.png"
                  alt="Camera Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Camera
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Lens problems, connectivity issues, recording repair
              </Typography>
            </CardContent>
          </Card>

          {/* Coffee Maker Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/coffe-maker-machine.png"
                  alt="Coffee Maker Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Coffee Maker
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Brewing issues, water flow problems, heating element
              </Typography>
            </CardContent>
          </Card>

          {/* Cooker Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/Cooker.png"
                  alt="Cooker Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Cooker
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Burner problems, ignition issues, temperature control
              </Typography>
            </CardContent>
          </Card>

          {/* Laptop / Computer Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/laptop-screen.png"
                  alt="Laptop Computer Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Laptops
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Screen repair, battery replacement, hardware issues
              </Typography>
            </CardContent>
          </Card>

          {/* Vacuum Cleaner Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/bread.png"
                  alt="Vacuum Cleaner Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Vacuum Cleaner
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Suction problems, brush roll issues, motor repair
              </Typography>
            </CardContent>
          </Card>

          {/* Gaming Console Repair */}
          <Card
            sx={{
              backgroundColor: '#FFFFFF',
              border: '2px solid #D9D9D9',
              borderRadius: '16px',
              '&:hover': {
                borderColor: '#22B1FB',
                backgroundColor: '#21B2FA',
                transform: 'translateY(-4px)',
                transition: 'all 0.3s ease',
              },
            }}
          >
            <CardContent sx={{ padding: 1, textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '120px' }}>
              <Box sx={{ marginBottom: 1, marginTop: 2 }}>
                <Box
                  component="img"
                  src="/Console.png"
                  alt="Gaming Console Icon"
                  sx={{
                    width: '48px',
                    height: '48px',
                    objectFit: 'contain',
                  }}
                />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontWeight: 600,
                  color: '#022F49',
                  marginBottom: 1,
                }}
              >
                Gaming Console
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  color: '#666666',
                  fontSize: '0.8rem',
                  textAlign: 'center',
                }}
              >
                Disc drive issues, overheating, controller repair
              </Typography>
            </CardContent>
          </Card>
        </Box>
        
        {/* Schedule Repairs Button */}
        <Box sx={{ textAlign: 'center', marginTop: 4 }}>
          <Button
            variant="contained"
            onClick={handleScheduleClick}
            sx={{
              backgroundColor: '#22B1FB',
              color: '#FFFFFF',
              fontFamily: 'DM Sans, Arial, sans-serif',
              fontWeight: 600,
              fontSize: '1.1rem',
              textTransform: 'none',
              padding: '12px 32px',
              borderRadius: '12px',
              minHeight: '48px',
              '&:hover': {
                backgroundColor: '#022F49',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(34, 177, 251, 0.3)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Schedule Repairs
          </Button>
        </Box>
        </Container>
      </Box>



      {/* About Us Section */}
      <Box id="about" sx={{ padding: '60px 0', backgroundColor: '#E8F4FD' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '0.8fr 1.2fr' }, 
            gap: 6, 
            alignItems: 'center' 
          }}>
            {/* Left Side - Image */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: { xs: 'center', md: 'flex-start' },
              alignItems: 'center',
              marginLeft: { md: '-120px' }
            }}>
              <Box
                component="img"
                src="/Humans About.png"
                alt="About Us Image"
                sx={{
                  width: '100%',
                  maxWidth: '1800px',
                  height: 'auto',
                  objectFit: 'contain',
                  borderRadius: '16px',
                }}
              />
            </Box>

            {/* Right Side - Text Content */}
            <Box sx={{ 
              textAlign: { xs: 'center', md: 'left' }, 
              paddingLeft: { md: 0 },
              marginLeft: { md: '40px' }
            }}>
              <Typography
                variant="h2"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 600,
                  textAlign: { xs: 'center', md: 'left' },
                  marginBottom: 4,
                  color: '#022F49',
                }}
              >
                About Us
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  textAlign: { xs: 'center', md: 'left' },
                  color: '#333333',
                }}
              >
                Smart Applications is a leading appliance repair and smart technology service company dedicated to providing exceptional repair solutions for all your household and electronic devices. With years of experience and a team of certified technicians, we specialize in repairing refrigerators, washing machines, dishwashers, smart TVs, and a wide range of electronic devices.
                <br /><br />
                Our commitment to quality service, competitive pricing, and customer satisfaction has made us the trusted choice for thousands of customers. We use only genuine parts and follow industry best practices to ensure your appliances are restored to optimal performance. Whether it's a simple repair or complex troubleshooting, our expert team is here to help you get your devices working perfectly again.
              </Typography>
            </Box>
          </Box>
        </Container>
      </Box>


      {/* Contact Us Section */}
      <Box id="contact" sx={{ padding: '60px 0', backgroundColor: '#F5F7F9' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 6, 
            alignItems: 'flex-start' 
          }}>
            {/* Left Side - Contact Information */}
            <Box sx={{ marginLeft: { md: '-80px' } }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 600,
                  textAlign: { xs: 'center', md: 'left' },
                  marginBottom: 4,
                  color: '#022F49',
                }}
              >
                Have Questions Or Need Assistance?
              </Typography>
              
              <Typography
                variant="body1"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  fontSize: '1.1rem',
                  lineHeight: 1.8,
                  textAlign: { xs: 'center', md: 'left' },
                  color: '#333333',
                  marginBottom: 4,
                }}
              >
                Feel free to fill out the form on the right for any queries or service requests. We're here to help you with all your appliance repair and smart technology needs.
              </Typography>

              {/* Contact Details */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Phone */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: '#22B1FB', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '20px'
                  }}>
                    📞
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'DM Sans, Arial, sans-serif',
                        fontWeight: 600,
                        color: '#022F49',
                        marginBottom: 0.5,
                      }}
                    >
                      Phone
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: 'DM Sans, Arial, sans-serif',
                        color: '#666666',
                      }}
                    >
                      +1 (555) 123-4567
                    </Typography>
                  </Box>
                </Box>

                {/* Email */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: '#22B1FB', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '20px'
                  }}>
                    ✉️
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'DM Sans, Arial, sans-serif',
                        fontWeight: 600,
                        color: '#022F49',
                        marginBottom: 0.5,
                      }}
                    >
                      Email
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: 'DM Sans, Arial, sans-serif',
                        color: '#666666',
                      }}
                    >
                      info@smartapplications.com
                    </Typography>
                  </Box>
                </Box>

                {/* Location */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    width: '40px', 
                    height: '40px', 
                    backgroundColor: '#22B1FB', 
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FFFFFF',
                    fontSize: '20px'
                  }}>
                    📍
                  </Box>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontFamily: 'DM Sans, Arial, sans-serif',
                        fontWeight: 600,
                        color: '#022F49',
                        marginBottom: 0.5,
                      }}
                    >
                      Location
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontFamily: 'DM Sans, Arial, sans-serif',
                        color: '#666666',
                      }}
                    >
                      123 Smart Street, Tech City, TC 12345
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            {/* Right Side - Contact Form */}
            <Box sx={{ 
              backgroundColor: '#F5F7F9',
              padding: 4,
              borderRadius: '16px',
              border: '2px solid #D9D9D9'
            }}>
              <Typography
                variant="h4"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 600,
                  textAlign: 'center',
                  marginBottom: 3,
                  color: '#022F49',
                }}
              >
                Contact Form
              </Typography>

              <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                {/* Name Field */}
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontWeight: 600,
                      color: '#022F49',
                      marginBottom: 1,
                    }}
                  >
                    Name *
                  </Typography>
                  <Box
                    component="input"
                    type="text"
                    placeholder="Enter your full name"
                    sx={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #D9D9D9',
                      borderRadius: '8px',
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontSize: '1rem',
                      backgroundColor: '#FFFFFF',
                      '&:focus': {
                        outline: 'none',
                        borderColor: '#22B1FB',
                      },
                    }}
                  />
                </Box>

                {/* Email Field */}
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontWeight: 600,
                      color: '#022F49',
                      marginBottom: 1,
                    }}
                  >
                    Email *
                  </Typography>
                  <Box
                    component="input"
                    type="email"
                    placeholder="Enter your email address"
                    sx={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #D9D9D9',
                      borderRadius: '8px',
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontSize: '1rem',
                      backgroundColor: '#FFFFFF',
                      '&:focus': {
                        outline: 'none',
                        borderColor: '#22B1FB',
                      },
                    }}
                  />
                </Box>

                {/* Phone Field */}
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontWeight: 600,
                      color: '#022F49',
                      marginBottom: 1,
                    }}
                  >
                    Phone Number
                  </Typography>
                  <Box
                    component="input"
                    type="tel"
                    placeholder="Enter your phone number"
                    sx={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #D9D9D9',
                      borderRadius: '8px',
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontSize: '1rem',
                      backgroundColor: '#FFFFFF',
                      '&:focus': {
                        outline: 'none',
                        borderColor: '#22B1FB',
                      },
                    }}
                  />
                </Box>

                {/* Message Field */}
                <Box>
                  <Typography
                    variant="body1"
                    sx={{
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontWeight: 600,
                      color: '#022F49',
                      marginBottom: 1,
                    }}
                  >
                    Message *
                  </Typography>
                  <Box
                    component="textarea"
                    placeholder="Tell us about your inquiry or service request"
                    rows={4}
                    sx={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '2px solid #D9D9D9',
                      borderRadius: '8px',
                      fontFamily: 'DM Sans, Arial, sans-serif',
                      fontSize: '1rem',
                      backgroundColor: '#FFFFFF',
                      resize: 'vertical',
                      minHeight: '120px',
                      '&:focus': {
                        outline: 'none',
                        borderColor: '#22B1FB',
                      },
                    }}
                  />
                </Box>

                {/* Submit Button */}
                <Button
                  variant="contained"
                  sx={{
                    backgroundColor: '#22B1FB',
                    color: '#FFFFFF',
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    fontWeight: 600,
                    fontSize: '1rem',
                    textTransform: 'none',
                    padding: '12px 24px',
                    borderRadius: '12px',
                    marginTop: 2,
                    '&:hover': {
                      backgroundColor: '#022F49',
                    },
                  }}
                >
                  Send Message
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Footer Section */}
      <Box sx={{ 
        backgroundColor: '#022F49', 
        color: '#FFFFFF',
        padding: '30px 0 15px 0'
      }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, 
            gap: 4,
            marginBottom: 2
          }}>
            {/* Company Info */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 600,
                  marginBottom: 2,
                  color: '#FFFFFF',
                }}
              >
                Smart Applications
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: 'DM Sans, Arial, sans-serif',
                  lineHeight: 1.6,
                  color: '#CCCCCC',
                }}
              >
                Your trusted partner for appliance repair and smart technology services.
              </Typography>
            </Box>

            {/* Quick Links */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 600,
                  marginBottom: 2,
                  color: '#FFFFFF',
                }}
              >
                Quick Links
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#CCCCCC',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#22B1FB',
                    },
                  }}
                >
                  Home
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#CCCCCC',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#22B1FB',
                    },
                  }}
                >
                  Appliances
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#CCCCCC',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#22B1FB',
                    },
                  }}
                >
                  Repair Services
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#CCCCCC',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#22B1FB',
                    },
                  }}
                >
                  About Us
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#CCCCCC',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#22B1FB',
                    },
                  }}
                >
                  Contact
                </Typography>
              </Box>
            </Box>

            {/* Services */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 600,
                  marginBottom: 2,
                  color: '#FFFFFF',
                }}
              >
                Services
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#CCCCCC',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#22B1FB',
                    },
                  }}
                >
                  Refrigerator Repair
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#CCCCCC',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#22B1FB',
                    },
                  }}
                >
                  Washing Machine Repair
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#CCCCCC',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#22B1FB',
                    },
                  }}
                >
                  Dishwasher Repair
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#CCCCCC',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#22B1FB',
                    },
                  }}
                >
                  Smart TV Repair
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#CCCCCC',
                    cursor: 'pointer',
                    '&:hover': {
                      color: '#22B1FB',
                    },
                  }}
                >
                  Electronic Device Repair
                </Typography>
              </Box>
            </Box>

            {/* Contact Info */}
            <Box>
              <Typography
                variant="h6"
                sx={{
                  fontFamily: 'Wasted Vindey, Arial, sans-serif',
                  fontWeight: 600,
                  marginBottom: 2,
                  color: '#FFFFFF',
                }}
              >
                Contact Info
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#CCCCCC',
                  }}
                >
                  📞 +1 (555) 123-4567
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#CCCCCC',
                  }}
                >
                  ✉️ info@smartapplications.com
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: 'DM Sans, Arial, sans-serif',
                    color: '#CCCCCC',
                  }}
                >
                  📍 123 Smart Street, Tech City, TC 12345
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Bottom Bar */}
          <Box sx={{ 
            borderTop: '1px solid #444444',
            paddingTop: 2,
            textAlign: 'center'
          }}>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'DM Sans, Arial, sans-serif',
                color: '#CCCCCC',
                marginBottom: 2,
              }}
            >
              © 2025 Smart Applications. All rights reserved.
            </Typography>
            
            {/* Social Media Icons */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
              {/* Facebook */}
              <Box component="a" href="#" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#CCCCCC',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#22B1FB',
                  color: '#FFFFFF',
                  transform: 'scale(1.1)',
                },
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </Box>
              
              {/* Twitter */}
              <Box component="a" href="#" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#CCCCCC',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#22B1FB',
                  color: '#FFFFFF',
                  transform: 'scale(1.1)',
                },
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
              </Box>
              
              {/* Instagram */}
              <Box component="a" href="#" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#CCCCCC',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#22B1FB',
                  color: '#FFFFFF',
                  transform: 'scale(1.1)',
                },
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 6.62 5.367 11.987 11.988 11.987 6.62 0 11.987-5.367 11.987-11.987C24.014 5.367 18.637.001 12.017.001zM8.449 16.988c-1.297 0-2.448-.49-3.323-1.297C4.198 14.895 3.708 13.744 3.708 12.447s.49-2.448 1.297-3.323c.875-.807 2.026-1.297 3.323-1.297s2.448.49 3.323 1.297c.807.875 1.297 2.026 1.297 3.323s-.49 2.448-1.297 3.323c-.875.807-2.026 1.297-3.323 1.297zm7.83-9.781c-.49 0-.927-.175-1.297-.49-.37-.315-.49-.807-.49-1.297s.12-.982.49-1.297c.37-.315.807-.49 1.297-.49s.927.175 1.297.49c.37.315.49.807.49 1.297s-.12.982-.49 1.297c-.37.315-.807.49-1.297.49z"/>
                </svg>
              </Box>
              
              {/* YouTube */}
              <Box component="a" href="#" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#CCCCCC',
                textDecoration: 'none',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#22B1FB',
                  color: '#FFFFFF',
                  transform: 'scale(1.1)',
                },
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Schedule Appointment Modal */}
      <Modal
        open={isModalOpen}
        onClose={handleCloseModal}
        aria-labelledby="schedule-modal-title"
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 2,
        }}
      >
        <Box
          sx={{
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            padding: 4,
            maxWidth: '500px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            position: 'relative',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
          }}
        >
          {/* Close Button */}
          <IconButton
            onClick={handleCloseModal}
            sx={{
              position: 'absolute',
              right: 16,
              top: 16,
              color: '#666666',
              '&:hover': {
                color: '#FF0000',
                backgroundColor: '#FFE6E6',
              },
            }}
          >
            <CloseIcon />
          </IconButton>

          {/* Modal Content */}
          <Typography
            id="schedule-modal-title"
            variant="h5"
            sx={{
              fontFamily: 'Wasted Vindey, Arial, sans-serif',
              fontWeight: 600,
              color: '#022F49',
              marginBottom: 2,
              paddingRight: 4,
              marginTop: 0,
            }}
          >
            Schedule Repair Appointment
          </Typography>

          <Typography
            variant="body1"
            sx={{
              fontFamily: 'DM Sans, Arial, sans-serif',
              color: '#666666',
              marginBottom: 3,
              lineHeight: 1.6,
            }}
          >
            Need help with your appliance? Schedule a repair appointment with our expert technicians. 
            We'll contact you to confirm the appointment time and provide a detailed quote.
          </Typography>

          {/* Contact Information */}
          <Box sx={{ backgroundColor: '#F5F7F9', padding: 2, borderRadius: '8px', marginBottom: 3 }}>
            <Typography
              variant="h6"
              sx={{
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 600,
                color: '#022F49',
                marginBottom: 1,
              }}
            >
              Contact Information
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'DM Sans, Arial, sans-serif',
                color: '#666666',
                marginBottom: 0.5,
              }}
            >
              📞 +1 (555) 123-4567
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontFamily: 'DM Sans, Arial, sans-serif',
                color: '#666666',
              }}
            >
              ✉️ info@smartapplications.com
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {/* Name Field */}
            <TextField
              label="Full Name"
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                },
              }}
            />

            {/* Email Field */}
            <TextField
              label="Email Address"
              type="email"
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                },
              }}
            />

            {/* Phone Field */}
            <TextField
              label="Phone Number"
              type="tel"
              variant="outlined"
              required
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                },
              }}
            />

            {/* Repair Item Dropdown */}
            <FormControl variant="outlined" required>
              <InputLabel sx={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
                Select Item for Repair
              </InputLabel>
              <Select
                label="Select Item for Repair"
                sx={{
                  borderRadius: '8px',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                }}
              >
                {repairItems.map((item) => (
                  <MenuItem key={item} value={item} sx={{ fontFamily: 'DM Sans, Arial, sans-serif' }}>
                    {item}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Description Field */}
            <TextField
              label="Description of Issue"
              variant="outlined"
              multiline
              rows={3}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  fontFamily: 'DM Sans, Arial, sans-serif',
                },
              }}
            />

            {/* Schedule Button */}
            <Button
              variant="contained"
              type="submit"
              sx={{
                backgroundColor: '#22B1FB',
                color: '#FFFFFF',
                fontFamily: 'DM Sans, Arial, sans-serif',
                fontWeight: 600,
                fontSize: '1rem',
                textTransform: 'none',
                padding: '12px 24px',
                borderRadius: '12px',
                marginTop: 2,
                '&:hover': {
                  backgroundColor: '#022F49',
                },
              }}
            >
              Schedule Appointment
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default Home; 