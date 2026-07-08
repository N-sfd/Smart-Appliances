import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Chip, Button } from '@mui/material';
import OndemandVideoOutlinedIcon from '@mui/icons-material/OndemandVideoOutlined';
import { colors, fonts } from '../../theme';

interface RelatedVideoCardProps {
  title: string;
  description: string;
  category: string;
  youtubeId?: string;
  thumbnail?: string;
  sourceName?: string;
  fallbackImage?: string;
}

/**
 * Small sidebar media card. Shows a real embed only when an approved
 * youtubeId exists; otherwise shows a polished "coming soon" placeholder
 * that never implies a video is available (no play-button affordance).
 */
export default function RelatedVideoCard({
  title,
  description,
  category,
  youtubeId,
  sourceName,
  fallbackImage,
}: RelatedVideoCardProps) {
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
      <Box sx={{ p: 2.25, pb: 1.5 }}>
        {category && (
          <Chip
            label={category}
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
        <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '0.98rem', color: colors.navy, mb: 0.5 }}>
          {title}
        </Typography>
        <Typography sx={{ fontFamily: fonts.body, fontSize: '12.5px', color: colors.mutedText, lineHeight: 1.55 }}>
          {description}
        </Typography>
      </Box>

      {youtubeId ? (
        <Box sx={{ px: 2.25, pb: 2.25 }}>
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              aspectRatio: '16 / 9',
              borderRadius: '12px',
              overflow: 'hidden',
              backgroundColor: '#0A0A0A',
            }}
          >
            <Box
              component="iframe"
              src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
              title={`${title} — video guide`}
              loading="lazy"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          </Box>
          {sourceName && (
            <Typography sx={{ fontFamily: fonts.body, fontSize: '11px', color: colors.mutedText, mt: 0.75 }}>
              Video: {sourceName}
            </Typography>
          )}
        </Box>
      ) : (
        <Box
          sx={{
            mx: 2.25,
            mb: 2.25,
            borderRadius: '12px',
            textAlign: 'center',
            py: 3,
            px: 2,
            position: 'relative',
            overflow: 'hidden',
            backgroundImage: fallbackImage
              ? `linear-gradient(rgba(232,241,255,0.88), rgba(220,235,255,0.9)), url(${fallbackImage})`
              : `linear-gradient(135deg, ${colors.lightBlueBg} 0%, #DCEBFF 100%)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              borderRadius: '50%',
              backgroundColor: '#fff',
              color: colors.primaryBlue,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mx: 'auto',
              mb: 1.25,
              boxShadow: '0 4px 12px rgba(10,37,64,0.12)',
            }}
          >
            <OndemandVideoOutlinedIcon sx={{ fontSize: 21 }} />
          </Box>
          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.88rem', color: colors.navy, mb: 0.5 }}>
            Related Video Guide — Coming Soon
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '12px', color: colors.mutedText, lineHeight: 1.5, mb: 1.5 }}>
            A short video guide for this topic is coming soon.
          </Typography>
          <Button
            component={RouterLink}
            to="/resources/videos"
            variant="outlined"
            size="small"
            sx={{
              borderColor: colors.primaryBlue,
              color: colors.primaryBlue,
              backgroundColor: '#fff',
              fontFamily: fonts.body,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '12.5px',
              borderRadius: '10px',
              '&:hover': { backgroundColor: colors.lightBlueBg },
            }}
          >
            Browse Helpful Videos
          </Button>
        </Box>
      )}
    </Box>
  );
}
