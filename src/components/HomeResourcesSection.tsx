import React, { useMemo } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { colors, fonts } from '../theme';
import { getFeaturedArticles } from '../data/resourceArticles';
import { getEnabledVideos, VIDEO_TOPIC_PLACEHOLDERS } from '../data/resourceVideos';
import ResourceArticleCard from './resources/ResourceArticleCard';
import VideoCard from './resources/VideoCard';
import VideoCategoryPlaceholderCard from './resources/VideoCategoryPlaceholderCard';

const HomeResourcesSection: React.FC = () => {
  const featuredArticles = useMemo(() => getFeaturedArticles().slice(0, 3), []);
  const featuredVideo = useMemo(() => getEnabledVideos()[0], []);
  const featuredVideoTopic = useMemo(() => VIDEO_TOPIC_PLACEHOLDERS[0], []);

  return (
    <Box
      id="resources"
      sx={{
        py: { xs: 6, md: 8 },
        background: 'linear-gradient(180deg, #F0F6FF 0%, #FAFCFF 100%)',
        borderTop: `1px solid ${colors.border}`,
        borderBottom: `1px solid ${colors.border}`,
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 4.5 }}>
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.5rem', md: '1.85rem' },
              color: colors.navy,
              mb: 1,
            }}
          >
            Helpful Tips &amp; Home Care Guides
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '0.95rem',
              color: colors.mutedText,
              maxWidth: 560,
              mx: 'auto',
              lineHeight: 1.65,
            }}
          >
            Explore practical advice for maintaining appliances, improving efficiency, and knowing when to call a professional.
          </Typography>
        </Box>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' },
            gap: 2.5,
            mb: 4,
          }}
        >
          {featuredArticles.map((article) => (
            <ResourceArticleCard key={article.slug} article={article} />
          ))}

          {featuredVideo ? (
            <VideoCard video={featuredVideo} />
          ) : (
            <Box component={RouterLink} to="/resources/videos" sx={{ textDecoration: 'none', display: 'block' }}>
              <VideoCategoryPlaceholderCard topic={featuredVideoTopic} />
            </Box>
          )}
        </Box>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            variant="contained"
            component={RouterLink}
            to="/resources"
            endIcon={<ArrowForwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              backgroundColor: colors.primaryBlue,
              fontFamily: fonts.body,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '12px',
              px: 3.5,
              '&:hover': { backgroundColor: colors.navy },
            }}
          >
            Visit the Help Center
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default HomeResourcesSection;
