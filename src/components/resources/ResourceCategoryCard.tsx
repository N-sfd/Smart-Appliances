import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { colors, fonts } from '../../theme';
import type { ResourceCategory } from '../../data/resourceCategories';
import TopicIllustration from '../illustrations/TopicIllustration';

interface Props {
  category: ResourceCategory;
  articleCount: number;
}

export default function ResourceCategoryCard({ category, articleCount }: Props) {
  const Icon = category.icon;
  const countLabel = articleCount > 0
    ? `${articleCount} ${articleCount === 1 ? 'guide' : 'guides'}`
    : 'Explore guides';

  return (
    <Box
      component={RouterLink}
      to={`/resources/articles?category=${category.id}`}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        borderRadius: '18px',
        border: `1px solid ${colors.border}`,
        backgroundColor: '#fff',
        textDecoration: 'none',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(10,37,64,0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
        height: 352,
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 14px 34px rgba(10,37,64,0.1)',
          borderColor: colors.primaryBlue,
        },
      }}
    >
      <Box sx={{ width: '100%', height: 160, flexShrink: 0 }}>
        <TopicIllustration variant={category.id} title={category.label} />
      </Box>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.75, p: 2, flexGrow: 1 }}>
        <Box
          sx={{
            width: 38,
            height: 38,
            borderRadius: '50%',
            backgroundColor: colors.lightBlueBg,
            color: colors.primaryBlue,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mt: '-30px',
            border: '3px solid #fff',
            boxShadow: '0 2px 8px rgba(10,37,64,0.12)',
          }}
        >
          <Icon size={18} strokeWidth={1.8} />
        </Box>
        <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1rem', color: colors.navy }}>
          {category.label}
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.body,
            fontSize: '13px',
            color: colors.mutedText,
            lineHeight: 1.55,
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {category.description}
        </Typography>
        <Typography sx={{ fontFamily: fonts.body, fontSize: '11.5px', color: colors.mutedText, mt: 0.25 }}>
          {countLabel}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25 }}>
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '12.5px', color: colors.primaryBlue }}>
            View Guides
          </Typography>
          <ArrowForwardIcon sx={{ fontSize: 14, color: colors.primaryBlue }} />
        </Box>
      </Box>
    </Box>
  );
}
