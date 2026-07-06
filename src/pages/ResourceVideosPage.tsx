import React, { useMemo, useState } from 'react';
import { Box, Typography, Container, Chip } from '@mui/material';
import { colors, fonts } from '../theme';
import { useSeo } from '../hooks/useSeo';
import { RESOURCE_CATEGORIES, ResourceCategoryId } from '../data/resourceCategories';
import { getEnabledVideos, VIDEO_TOPIC_PLACEHOLDERS } from '../data/resourceVideos';
import VideoCard from '../components/resources/VideoCard';
import VideoCategoryPlaceholderCard from '../components/resources/VideoCategoryPlaceholderCard';
import ResourceBreadcrumbs from '../components/resources/ResourceBreadcrumbs';

export default function ResourceVideosPage() {
  const [category, setCategory] = useState<ResourceCategoryId | null>(null);

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

  const videoTopicCategoryIds = useMemo(() => new Set(VIDEO_TOPIC_PLACEHOLDERS.map((t) => t.category)), []);
  const categoriesWithVideos = useMemo(
    () => RESOURCE_CATEGORIES.filter((c) => videoTopicCategoryIds.has(c.id) || enabledVideos.some((v) => v.category === c.id)),
    [enabledVideos, videoTopicCategoryIds],
  );

  const visibleVideos = category ? enabledVideos.filter((v) => v.category === category) : enabledVideos;
  const visiblePlaceholders = VIDEO_TOPIC_PLACEHOLDERS
    .filter((t) => !category || t.category === category)
    .filter((t) => !enabledVideos.some((v) => v.category === t.category));

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

        {categoriesWithVideos.length > 0 && (
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 4 }}>
            <Chip
              label="All"
              onClick={() => setCategory(null)}
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
                  onClick={() => setCategory(isActive ? null : c.id)}
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

        {visiblePlaceholders.length > 0 && (
          <Box
            sx={{
              mb: 3,
              p: 2,
              borderRadius: '14px',
              backgroundColor: colors.lightBlueBg,
              border: `1px solid ${colors.border}`,
              textAlign: 'center',
            }}
          >
            <Typography sx={{ fontFamily: fonts.body, fontSize: '13.5px', color: colors.navy, fontWeight: 600 }}>
              We&apos;re preparing short how-to videos for appliance care, HVAC, plumbing, electrical safety, smart home,
              and garage door maintenance. Categories marked &quot;Coming Soon&quot; below will be filled in as videos are added.
            </Typography>
          </Box>
        )}

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2.5 }}>
          {visibleVideos.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
          {visiblePlaceholders.map((topic) => (
            <VideoCategoryPlaceholderCard key={topic.category} topic={topic} />
          ))}
        </Box>
      </Container>
    </Box>
  );
}
