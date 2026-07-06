import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Chip } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ClipboardList } from 'lucide-react';
import { colors, fonts } from '../../theme';
import type { ResourceArticle } from '../../data/resourceArticles';
import { getResourceCategory } from '../../data/resourceCategories';
import ResourceImage from './ResourceImage';

interface Props {
  article: ResourceArticle;
  variant?: 'default' | 'featured';
}

const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

export default function ResourceArticleCard({ article, variant = 'default' }: Props) {
  const category = getResourceCategory(article.category);
  const isFeatured = variant === 'featured';

  return (
    <Box
      component={RouterLink}
      to={`/resources/${article.slug}`}
      sx={{
        display: 'flex',
        flexDirection: isFeatured ? { xs: 'column', md: 'row' } : 'column',
        gap: isFeatured ? 3 : 0,
        borderRadius: '18px',
        border: `1px solid ${colors.border}`,
        backgroundColor: '#fff',
        textDecoration: 'none',
        overflow: 'hidden',
        boxShadow: '0 4px 16px rgba(10,37,64,0.05)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        height: '100%',
        '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 14px 34px rgba(10,37,64,0.1)' },
      }}
    >
      <ResourceImage
        src={article.image}
        alt={article.imageAlt}
        icon={category?.icon ?? ClipboardList}
        illustrationVariant={article.category}
        aspectRatio="16 / 10"
        borderRadius="0"
        sx={isFeatured ? { width: { xs: '100%', md: '46%' }, flexShrink: 0 } : undefined}
      />
      <Box sx={{ p: isFeatured ? { xs: 2.5, md: 3 } : 2.25, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {category && (
          <Chip
            label={category.label}
            size="small"
            sx={{
              alignSelf: 'flex-start',
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
        <Typography
          sx={{
            fontFamily: fonts.heading,
            fontWeight: 800,
            fontSize: isFeatured ? { xs: '1.15rem', md: '1.35rem' } : '1rem',
            color: colors.navy,
            lineHeight: 1.3,
            mb: 0.75,
          }}
        >
          {article.title}
        </Typography>
        <Typography
          sx={{
            fontFamily: fonts.body,
            fontSize: '13px',
            color: colors.mutedText,
            lineHeight: 1.55,
            mb: 1.25,
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: isFeatured ? 3 : 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {article.excerpt}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.4 }}>
            <AccessTimeIcon sx={{ fontSize: 13, color: colors.mutedText }} />
            <Typography sx={{ fontFamily: fonts.body, fontSize: '11.5px', color: colors.mutedText }}>
              {article.readingTime}
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '11.5px', color: colors.mutedText }}>
            · {formatDate(article.publishedAt)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
