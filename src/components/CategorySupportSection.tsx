import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { fonts } from '../theme';
import type { ServiceSupportContent } from '../data/servicePageContent';

interface CategorySupportSectionProps {
  content: ServiceSupportContent;
}

/**
 * Always-on, category-correct reassurance block. Unlike the interactive booking
 * detail panel above it (which depends on which card is selected), this section
 * has no fallback path that can resolve to another category's content.
 */
const CategorySupportSection: React.FC<CategorySupportSectionProps> = ({ content }) => (
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
        <Box
          component="img"
          src={content.image}
          alt={content.imageAlt}
          loading="lazy"
          width={560}
          height={320}
          sx={{
            width: '100%',
            height: { xs: 220, sm: 280, md: 320 },
            objectFit: 'cover',
            borderRadius: '20px',
            display: 'block',
            boxShadow: '0 12px 40px rgba(10,37,64,0.10)',
          }}
        />

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

          <Box>
            {content.bullets.map((bullet) => (
              <Box key={bullet.title} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.25, mb: 2 }}>
                <CheckCircleOutlineIcon sx={{ color: '#1A73E8', fontSize: 21, mt: 0.15, flexShrink: 0 }} />
                <Box>
                  <Typography
                    sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.92rem', color: '#1A1A1A', lineHeight: 1.4 }}
                  >
                    {bullet.title}
                  </Typography>
                  <Typography
                    sx={{ fontFamily: fonts.body, fontSize: '0.87rem', color: '#64748B', lineHeight: 1.6, mt: 0.25 }}
                  >
                    {bullet.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Container>
  </Box>
);

export default CategorySupportSection;
