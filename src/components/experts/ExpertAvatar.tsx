import React, { useState } from 'react';
import { Box } from '@mui/material';
import { colors, fonts } from '../../theme';

interface Props {
  name: string;
  avatarUrl?: string;
  size: number;
  fontSize: number;
}

export default function ExpertAvatar({ name, avatarUrl, size, fontSize }: Props) {
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
        width: size,
        height: size,
        borderRadius: '50%',
        flexShrink: 0,
        backgroundColor: colors.lightBlueBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        fontFamily: fonts.body,
        fontWeight: 700,
        fontSize,
        color: colors.primaryBlue,
      }}
    >
      {showImage ? (
        <Box
          component="img"
          src={avatarUrl}
          alt={name}
          onError={() => setErrored(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        initials
      )}
    </Box>
  );
}
