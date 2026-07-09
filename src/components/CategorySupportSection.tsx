import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container, Typography, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { fonts } from '../theme';
import type { ServiceSupportContent } from '../data/servicePageContent';
import { getCategoryHeroFallback } from '../data/categoryHeroFallbacks';
import { SERVICE_SLUG_TO_SCHEDULER } from '../data/schedulerPrefill';

interface CategorySupportSectionProps {
  content: ServiceSupportContent;
}

/**
 * Always-on, category-correct reassurance block. Unlike the interactive booking
 * detail panel above it (which depends on which card is selected), this section
 * has no fallback path that can resolve to another category's content.
 */
const CategorySupportSection: React.FC<CategorySupportSectionProps> = ({ content }) => {
  const navigate = useNavigate();
  const [imageErrored, setImageErrored] = useState(false);
  const fallback = getCategoryHeroFallback(content.categorySlug);

  const handleSchedule = () => {
    const schedulerCategory = SERVICE_SLUG_TO_SCHEDULER[content.categorySlug];
    const query = schedulerCategory ? `?serviceCategory=${encodeURIComponent(schedulerCategory)}` : '';
    navigate(`/scheduler${query}`);
  };

  return (
    <Box sx={{ py: { xs: 6, md: 8 }, backgroundColor: '#F8FAFC', borderTop: '1px solid #EEF0F3' }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: { xs: 3, md: 6 },
            alignItems: 'center',
          }}
        >
          {imageErrored && fallback ? (
            <Box
              sx={{
                width: '100%',
                height: { xs: 220, sm: 300, md: 400 },
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 12px 40px rgba(10,37,64,0.10)',
              }}
            >
              <Box component="img" src={fallback} alt={content.imageAlt} sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            </Box>
          ) : (
            <Box
              component="img"
              src={content.image}
              alt={content.imageAlt}
              loading="lazy"
              width={560}
              height={400}
              onError={() => setImageErrored(true)}
              sx={{
                width: '100%',
                height: { xs: 220, sm: 300, md: 400 },
                objectFit: 'cover',
                objectPosition: 'center 25%',
                borderRadius: '20px',
                display: 'block',
                boxShadow: '0 12px 40px rgba(10,37,64,0.10)',
              }}
            />
          )}

          <Box>
            <Typography
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 800,
                fontSize: { xs: '1.4rem', md: '1.65rem' },
                color: '#0B3D91',
                mb: 1.5,
                lineHeight: 1.25,
              }}
            >
              {content.title}
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.body,
                color: '#64748B',
                fontSize: '0.98rem',
                lineHeight: 1.7,
                mb: 3,
              }}
            >
              {content.subtitle}
            </Typography>

            <Box sx={{ mb: 3.5 }}>
              {content.bullets.map((bullet) => (
                <Box key={bullet} sx={{ display: 'flex', alignItems: 'center', gap: 1.25, mb: 1.5 }}>
                  <CheckCircleOutlineIcon sx={{ color: '#1A73E8', fontSize: 21, flexShrink: 0 }} />
                  <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.92rem', color: '#1A1A1A' }}>
                    {bullet}
                  </Typography>
                </Box>
              ))}
            </Box>

            <Button
              variant="contained"
              onClick={handleSchedule}
              sx={{
                backgroundColor: '#1A73E8',
                color: '#FFFFFF',
                fontFamily: fonts.body,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '12px',
                px: 3.5,
                py: 1.25,
                '&:hover': { backgroundColor: '#0B3D91' },
              }}
            >
              Schedule Service
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CategorySupportSection;
