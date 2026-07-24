import React, { useMemo, useState } from 'react';
import { Box, Typography, Container, Chip, Button } from '@mui/material';
import { colors, fonts } from '../theme';
import { useSeo } from '../hooks/useSeo';
import { RESOURCE_CATEGORIES, ResourceCategoryId } from '../data/resourceCategories';
import { getEnabledVideos } from '../data/resourceVideos';
import VideoCard from '../components/resources/VideoCard';
import VideosComingSoonPanel from '../components/resources/VideosComingSoonPanel';
import ResourceBreadcrumbs from '../components/resources/ResourceBreadcrumbs';

const PAGE_SIZE = 6;

export default function ResourceVideosPage() {
  const [category, setCategory] = useState<ResourceCategoryId | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useSeo({
    title: 'Helpful Home Service Videos | Smart Appliances',
    description: 'Watch useful maintenance, appliance care, and home-safety videos from Smart Appliances.',
    path: '/resources/videos',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Help Center', path: '/resources' },
      { name: 'Videos', path: '/resources/videos' },
    ],
  });

  const enabledVideos = useMemo(() => getEnabledVideos(), []);

  const categoriesWithVideos = useMemo(
    () => RESOURCE_CATEGORIES.filter((c) => enabledVideos.some((v) => v.category === c.id)),
    [enabledVideos],
  );

  const filteredVideos = category ? enabledVideos.filter((v) => v.category === category) : enabledVideos;
  const visibleVideos = filteredVideos.slice(0, visibleCount);

  const handleSelectCategory = (id: ResourceCategoryId | null) => {
    setCategory(id);
    setVisibleCount(PAGE_SIZE);
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 4 }, pb: { xs: 6, md: 8 } }}>
        <Box sx={{ mb: 2.5 }}>
          <ResourceBreadcrumbs
            items={[
              { label: 'Help Center', path: '/resources' },
              { label: 'Videos' },
            ]}
          />
        </Box>

        <Typography component="h1" sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.1rem' }, color: colors.navy, mb: 1 }}>
          Helpful Home Service Videos
        </Typography>
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.95rem', color: colors.mutedText, mb: 3.5, maxWidth: 640 }}>
          Watch useful maintenance, appliance care, and home-safety videos.
        </Typography>

        {enabledVideos.length === 0 ? (
          <VideosComingSoonPanel />
        ) : (
          <>
            {categoriesWithVideos.length > 0 && (
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
                <Chip
                  label="All"
                  onClick={() => handleSelectCategory(null)}
                  sx={{
                    fontFamily: fonts.body,
                    fontWeight: !category ? 700 : 500,
                    fontSize: '0.8rem',
                    backgroundColor: !category ? colors.primaryBlue : colors.lightBlueBg,
                    color: !category ? '#fff' : colors.primaryBlue,
                    '&:hover': { backgroundColor: !category ? colors.navy : '#D9E8FB' },
                  }}
                />
                {categoriesWithVideos.map((c) => {
                  const isActive = category === c.id;
                  return (
                    <Chip
                      key={c.id}
                      label={c.label}
                      onClick={() => handleSelectCategory(isActive ? null : c.id)}
                      sx={{
                        fontFamily: fonts.body,
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.8rem',
                        backgroundColor: isActive ? colors.primaryBlue : colors.lightBlueBg,
                        color: isActive ? '#fff' : colors.primaryBlue,
                        '&:hover': { backgroundColor: isActive ? colors.navy : '#D9E8FB' },
                      }}
                    />
                  );
                })}
              </Box>
            )}

            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
              {visibleVideos.map((video) => (
                <VideoCard key={video.id} video={video} />
              ))}
            </Box>
            {visibleCount < filteredVideos.length && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  sx={{ borderColor: colors.border, color: colors.navy, fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '12px', px: 3.5, '&:hover': { borderColor: colors.primaryBlue, color: colors.primaryBlue, backgroundColor: colors.lightBlueBg } }}
                >
                  Load More Videos
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
