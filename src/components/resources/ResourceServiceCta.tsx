import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { colors, fonts } from '../../theme';
import type { ResourceArticle } from '../../data/resourceArticles';

interface Props {
  article: ResourceArticle;
}

export default function ResourceServiceCta({ article }: Props) {
  const navigate = useNavigate();

  const bookHref = article.serviceCategory
    ? `/scheduler?serviceType=R&serviceCategory=${encodeURIComponent(article.serviceCategory)}&productName=${encodeURIComponent(article.schedulerProductName)}`
    : '/scheduler';

  return (
    <Box
      sx={{
        borderRadius: '18px',
        backgroundColor: colors.navy,
        color: '#fff',
        p: { xs: 2.75, md: 3.5 },
        textAlign: { xs: 'left', md: 'center' },
      }}
    >
      <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.15rem', md: '1.3rem' }, mb: 1 }}>
        {article.ctaQuestion}
      </Typography>
      <Typography sx={{ fontFamily: fonts.body, fontSize: '13.5px', color: '#E2E8F0', mb: 2.25 }}>
        Book online in minutes and get a request ID to track your service.
      </Typography>
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
    </Box>
  );
}
