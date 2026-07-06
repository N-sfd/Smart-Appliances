import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { colors, fonts } from '../../theme';
import type { ResourceVideo } from '../../data/resourceVideos';
import { getResourceCategory } from '../../data/resourceCategories';
import YouTubeEmbed from './YouTubeEmbed';

interface Props {
  video: ResourceVideo;
}

/** Only meant to receive videos that are already enabled with a youtubeId. */
export default function VideoCard({ video }: Props) {
  if (!video.youtubeId) return null;
  const category = getResourceCategory(video.category);

  return (
    <Box
      sx={{
        borderRadius: '18px',
        border: `1px solid ${colors.border}`,
        backgroundColor: '#fff',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(10,37,64,0.05)',
      }}
    >
      <YouTubeEmbed youtubeId={video.youtubeId} title={video.title} orientation={video.orientation} />
      <Box sx={{ p: 2.25 }}>
        {category && (
          <Chip
            label={category.label}
            size="small"
            sx={{
              mb: 1,
              backgroundColor: colors.lightBlueBg,
              color: colors.primaryBlue,
              fontFamily: fonts.body,
              fontWeight: 600,
              fontSize: '11px',
              height: 22,
            }}
          />
        )}
        <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.95rem', color: colors.navy, mb: 0.5 }}>
          {video.title}
        </Typography>
        <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.mutedText, lineHeight: 1.55, mb: video.sourceUrl ? 1 : 0 }}>
          {video.description}
        </Typography>
        {video.sourceUrl && (
          <Box
            component="a"
            href={video.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.5,
              fontFamily: fonts.body,
              fontSize: '12px',
              fontWeight: 600,
              color: colors.primaryBlue,
              textDecoration: 'none',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {video.sourceName ? `Watch on ${video.sourceName}` : 'Watch on YouTube'}
            <OpenInNewIcon sx={{ fontSize: 13 }} />
          </Box>
        )}
      </Box>
    </Box>
  );
}
