import React from 'react';
import { Box, Typography, Chip } from '@mui/material';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { colors, fonts } from '../../theme';
import type { VideoTopicPlaceholder } from '../../data/resourceVideos';
import TopicIllustration from '../illustrations/TopicIllustration';
import { getResourceCategory } from '../../data/resourceCategories';

interface Props {
  topic: VideoTopicPlaceholder;
}

/** Professional "coming soon" stand-in for a video category, shown until a real video is enabled. */
export default function VideoCategoryPlaceholderCard({ topic }: Props) {
  const category = getResourceCategory(topic.category);

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
      <Box sx={{ position: 'relative', width: '100%', aspectRatio: '16 / 9' }}>
        <TopicIllustration variant={topic.category} title={`${topic.title} — video coming soon`} />
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(11,37,69,0.28)',
          }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              backgroundColor: 'rgba(255,255,255,0.92)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <PlayArrowRoundedIcon sx={{ fontSize: 26, color: colors.primaryBlue }} />
          </Box>
        </Box>
        <Chip
          label="Coming Soon"
          size="small"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            backgroundColor: 'rgba(255,255,255,0.95)',
            color: colors.navy,
            fontFamily: fonts.body,
            fontWeight: 700,
            fontSize: '10.5px',
            height: 22,
          }}
        />
      </Box>
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
          {topic.title}
        </Typography>
        <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.mutedText, lineHeight: 1.55 }}>
          {topic.description}
        </Typography>
      </Box>
    </Box>
  );
}
