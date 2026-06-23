import React, { useState } from 'react';
import { Box, Typography } from '@mui/material';
import { colors, fonts } from '../../theme';

interface Props {
  name: string;
  avatarUrl?: string;
  height?: number;
}

/** Rectangular top-of-card banner image (object-fit: cover) with an initials fallback if the image fails to load. */
export default function ExpertCardImage({ name, avatarUrl, height = 200 }: Props) {
  const [errored, setErrored] = useState(false);
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const showImage = Boolean(avatarUrl) && !errored;

  return (
    <Box
      sx={{
        height,
        flexShrink: 0,
        borderRadius: '20px 20px 0 0',
        overflow: 'hidden',
        backgroundColor: colors.lightBlueBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {showImage ? (
        <Box
          component="img"
          src={avatarUrl}
          alt={`${name} — Smart Appliances service expert`}
          onError={() => setErrored(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        <Typography
          sx={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: '2.5rem',
            color: colors.primaryBlue,
          }}
        >
          {initials}
        </Typography>
      )}
    </Box>
  );
}
