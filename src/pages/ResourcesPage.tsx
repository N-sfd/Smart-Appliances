import React from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import { colors, fonts } from '../theme';
import { useSeo } from '../hooks/useSeo';
import { RESOURCE_CATEGORIES } from '../data/resourceCategories';
import { RESOURCE_ARTICLES, getArticlesByCategory, getFeaturedArticles } from '../data/resourceArticles';
import { getEnabledVideos } from '../data/resourceVideos';
import ResourceCategoryCard from '../components/resources/ResourceCategoryCard';
import ResourceArticleCard from '../components/resources/ResourceArticleCard';
import VideoCard from '../components/resources/VideoCard';
import VideosComingSoonPanel from '../components/resources/VideosComingSoonPanel';
import HeroIllustration from '../components/illustrations/HeroIllustration';

export default function ResourcesPage() {
  const navigate = useNavigate();

  useSeo({
    title: 'Smart Appliances Help Center | Appliance Care & Home Maintenance Tips',
    description: 'Explore appliance troubleshooting, HVAC energy-saving advice, electrical safety, plumbing maintenance, smart home guides, and garage door care.',
    path: '/resources',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Help Center', path: '/resources' },
    ],
  });

  const featuredArticles = getFeaturedArticles();
  const enabledVideos = getEnabledVideos();

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      {/* HERO */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #071B41 0%, #0B2D6B 55%, #0D3A82 100%)',
          py: { xs: 4, md: 4.5 },
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: { xs: 3, md: 4 },
            }}
          >
            <Box sx={{ flex: '1 1 auto', minWidth: 0, textAlign: { xs: 'center', md: 'left' } }}>
              <Typography
                component="h1"
                sx={{
                  fontFamily: fonts.heading,
                  fontWeight: 800,
                  fontSize: { xs: '1.75rem', md: '2.15rem' },
                  color: '#fff',
                  lineHeight: 1.15,
                  mb: 1.25,
                }}
              >
                Smart Appliances Help Center
              </Typography>
              <Typography
                sx={{
                  fontFamily: fonts.body,
                  fontSize: { xs: '0.9rem', md: '1rem' },
                  color: '#E2E8F0',
                  maxWidth: 480,
                  mx: { xs: 'auto', md: 0 },
                  mb: 2.5,
                  lineHeight: 1.6,
                }}
              >
                Practical appliance care, home maintenance, safety guidance, troubleshooting tips, and expert advice.
              </Typography>

              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.25, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                <Button
                  variant="contained"
                  startIcon={<ArticleOutlinedIcon />}
                  component={RouterLink}
                  to="/resources/articles"
                  sx={{ backgroundColor: '#fff', color: '#0B2D6B', fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '12px', px: 2.5, '&:hover': { backgroundColor: '#E2E8F0' } }}
                >
                  Browse Articles
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<OndemandVideoOutlinedIcon />}
                  component={RouterLink}
                  to="/resources/videos"
                  sx={{ borderColor: '#E2E8F0', color: '#E2E8F0', fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '12px', px: 2.5, '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' } }}
                >
                  Watch Helpful Videos
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<CalendarMonthIcon />}
                  onClick={() => navigate('/scheduler')}
                  sx={{ borderColor: '#E2E8F0', color: '#E2E8F0', fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '12px', px: 2.5, '&:hover': { borderColor: '#fff', backgroundColor: 'rgba(255,255,255,0.08)' } }}
                >
                  Book a Service
                </Button>
              </Box>
            </Box>

            <Box sx={{ flex: '0 0 auto', width: { xs: 180, sm: 200, md: 190 }, display: { xs: 'none', sm: 'block' } }}>
              <HeroIllustration variant="resources" title="Homeowner researching appliance and home maintenance guidance" />
            </Box>
          </Box>
        </Container>
      </Box>

      {/* CATEGORY CARDS */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Typography
          sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.65rem' }, color: colors.navy, textAlign: 'center', mb: 0.75 }}
        >
          Browse by category
        </Typography>
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.92rem', color: colors.mutedText, textAlign: 'center', mb: 4 }}>
          {RESOURCE_ARTICLES.length} original guides across appliance, HVAC, plumbing, electrical, smart home, and garage door topics.
        </Typography>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {RESOURCE_CATEGORIES.map((category) => (
            <ResourceCategoryCard
              key={category.id}
              category={category}
              articleCount={getArticlesByCategory(category.id).length}
            />
          ))}
        </Box>
      </Container>

      {/* POPULAR GUIDES */}
      {featuredArticles.length > 0 && (
        <Box sx={{ py: { xs: 5, md: 7 }, backgroundColor: colors.lightBlueBg }}>
          <Container maxWidth="lg">
            <Typography
              sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.65rem' }, color: colors.navy, textAlign: 'center', mb: 4 }}
            >
              Popular guides
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2.5, mb: 4 }}>
              {featuredArticles.map((article) => (
                <ResourceArticleCard key={article.slug} article={article} />
              ))}
            </Box>
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="contained"
                component={RouterLink}
                to="/resources/articles"
                sx={{ backgroundColor: colors.primaryBlue, fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '12px', px: 3.5, '&:hover': { backgroundColor: colors.navy } }}
              >
                View All Articles
              </Button>
            </Box>
          </Container>
        </Box>
      )}

      {/* HELPFUL VIDEOS PREVIEW */}
      <Box sx={{ py: { xs: 5, md: 7 } }}>
        <Container maxWidth="lg">
          <Typography
            sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.65rem' }, color: colors.navy, textAlign: 'center', mb: 0.75 }}
          >
            Helpful videos
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.92rem', color: colors.mutedText, textAlign: 'center', mb: 4 }}>
            Short how-to videos across appliance care, HVAC, plumbing, electrical safety, smart home, and garage door topics.
          </Typography>
          {enabledVideos.length > 0 ? (
            <>
              <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2.5, mb: 4 }}>
                {enabledVideos.slice(0, 3).map((video) => (
                  <VideoCard key={video.id} video={video} />
                ))}
              </Box>
              <Box sx={{ textAlign: 'center' }}>
                <Button
                  variant="outlined"
                  component={RouterLink}
                  to="/resources/videos"
                  sx={{ borderColor: colors.border, color: colors.navy, fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '12px', px: 3.5, '&:hover': { borderColor: colors.primaryBlue, color: colors.primaryBlue, backgroundColor: colors.lightBlueBg } }}
                >
                  Browse All Videos
                </Button>
              </Box>
            </>
          ) : (
            <VideosComingSoonPanel />
          )}
        </Container>
      </Box>
    </Box>
  );
}
