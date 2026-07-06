import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { colors, fonts } from '../../theme';
import { getRelatedArticles, type ResourceArticle } from '../../data/resourceArticles';

interface Props {
  article: ResourceArticle;
}

export default function ResourceServiceCta({ article }: Props) {
  const navigate = useNavigate();

  const bookHref = article.serviceCategory
    ? `/scheduler?serviceType=R&serviceCategory=${encodeURIComponent(article.serviceCategory)}&productName=${encodeURIComponent(article.schedulerProductName)}`
    : '/scheduler';

  const relatedGuide = getRelatedArticles(article)[0];

  return (
    <Box
      sx={{
        borderRadius: '18px',
        backgroundColor: colors.navy,
        color: '#fff',
        p: { xs: 2.25, md: 2.75 },
        textAlign: { xs: 'left', md: 'center' },
      }}
    >
      <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.1rem', md: '1.2rem' }, mb: 0.75 }}>
        {article.ctaQuestion}
      </Typography>
      <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: '#E2E8F0', mb: 1.75 }}>
        Book online in minutes and get a request ID to track your service.
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, justifyContent: { xs: 'flex-start', md: 'center' } }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: '#fff',
            color: colors.navy,
            fontFamily: fonts.body,
            fontWeight: 700,
            textTransform: 'none',
            borderRadius: '12px',
            px: 3.5,
            '&:hover': { backgroundColor: '#E2E8F0' },
          }}
          onClick={() => navigate(bookHref)}
        >
          {article.ctaLabel}
        </Button>
        {relatedGuide && (
          <Button
            variant="outlined"
            sx={{
              borderColor: 'rgba(255,255,255,0.5)',
              color: '#fff',
              fontFamily: fonts.body,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '12px',
              px: 3.5,
              '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' },
            }}
            onClick={() => navigate(`/resources/${relatedGuide.slug}`)}
          >
            View Related Guide
          </Button>
        )}
      </Box>
    </Box>
  );
}
