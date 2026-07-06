import React from 'react';
import { Box } from '@mui/material';

interface Props {
  youtubeId: string;
  title: string;
  orientation?: 'landscape' | 'portrait';
}

/** Responsive, lazy-loaded, privacy-enhanced YouTube embed. Never autoplays. */
export default function YouTubeEmbed({ youtubeId, title, orientation = 'landscape' }: Props) {
  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        maxWidth: orientation === 'portrait' ? 360 : '100%',
        mx: orientation === 'portrait' ? 'auto' : 0,
        aspectRatio: orientation === 'portrait' ? '9 / 16' : '16 / 9',
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: '#0A0A0A',
      }}
    >
      <Box
        component="iframe"
        src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
      />
    </Box>
  );
}
