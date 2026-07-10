import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container, Button, useMediaQuery, useTheme } from '@mui/material';
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
import PageHero from '../components/common/PageHero';
import BrandsDirectory from '../components/brands/BrandsDirectory';

const CATEGORY_GRID_ID = 'resource-category-grid';

export default function ResourcesPage() {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMdUp = useMediaQuery(theme.breakpoints.up('md'));
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));
  const [showAllCategories, setShowAllCategories] = useState(false);

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

  // Collapsed counts match the grid's own column counts (4/2/1) exactly, so the
  // collapsed view never ends on a partial row.
  const collapsedCategoryCount = isMdUp ? 8 : isSmUp ? 6 : 4;
  const hasMoreCategories = RESOURCE_CATEGORIES.length > collapsedCategoryCount;
  const visibleCategories = showAllCategories
    ? RESOURCE_CATEGORIES
    : RESOURCE_CATEGORIES.slice(0, collapsedCategoryCount);

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <PageHero
        title="Smart Appliances Help Center"
        subtitle="Practical appliance care, home maintenance, safety guidance, troubleshooting tips, and expert advice."
        primaryAction={{ label: 'Browse Articles', href: '/resources/articles', startIcon: <ArticleOutlinedIcon /> }}
        secondaryAction={{ label: 'Watch Helpful Videos', href: '/resources/videos', startIcon: <OndemandVideoOutlinedIcon /> }}
        tertiaryAction={{ label: 'Book a Service', onClick: () => navigate('/scheduler'), startIcon: <CalendarMonthIcon /> }}
        illustration="resources"
        imageAlt="Homeowner researching appliance and home maintenance guidance"
      />

      {/* CATEGORY CARDS */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 7 } }}>
        <Typography
          sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.4rem', md: '1.65rem' }, color: colors.navy, textAlign: 'center', mb: 0.75 }}
        >
          Helpful Guides and Resources
        </Typography>
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.92rem', color: colors.mutedText, textAlign: 'center', mb: 6, maxWidth: 640, mx: 'auto' }}>
          Browse {RESOURCE_ARTICLES.length} maintenance, repair, installation, and safety guides across appliance, HVAC, plumbing, electrical, smart home, and garage door topics.
        </Typography>
        <Box
          id={CATEGORY_GRID_ID}
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
            gap: 2,
          }}
        >
          {visibleCategories.map((category) => (
            <ResourceCategoryCard
              key={category.id}
              category={category}
              articleCount={getArticlesByCategory(category.id).length}
            />
          ))}
        </Box>

        {hasMoreCategories && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Button
              onClick={() => setShowAllCategories((prev) => !prev)}
              aria-expanded={showAllCategories}
              aria-controls={CATEGORY_GRID_ID}
              variant="outlined"
              sx={{
                borderColor: colors.primaryBlue,
                color: colors.primaryBlue,
                fontFamily: fonts.body,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '12px',
                px: 3,
                '&:hover': {
                  borderColor: colors.navy,
                  color: colors.navy,
                  backgroundColor: colors.lightBlueBg,
                },
              }}
            >
              {showAllCategories ? 'Show Fewer Resources' : 'View All Resources'}
            </Button>
          </Box>
        )}
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

      <BrandsDirectory />
    </Box>
  );
}
