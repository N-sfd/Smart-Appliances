import React, { useState } from 'react';
import { Box, SxProps, Theme } from '@mui/material';
import type { LucideIcon } from 'lucide-react';
import { colors } from '../../theme';
import TopicIllustration from '../illustrations/TopicIllustration';
import ArticleTopicIllustration, { hasArticleIllustration } from '../illustrations/ArticleTopicIllustration';
import type { ResourceCategoryId } from '../../data/resourceCategories';

interface ResourceImageProps {
  src?: string | null;
  alt: string;
  icon: LucideIcon;
  /** Article slug — when a dedicated scene exists for it, takes priority over the category illustration so articles that share a category don't all show the same art. */
  articleSlug?: string;
  /** Resource category — when present, the fallback renders a topical vector scene instead of a plain icon. */
  illustrationVariant?: ResourceCategoryId;
  aspectRatio?: string;
  borderRadius?: string;
  sx?: SxProps<Theme>;
}

/** Topic image with an illustration/icon fallback — never shows a broken-image icon. */
export default function ResourceImage({
  src,
  alt,
  icon: Icon,
  articleSlug,
  illustrationVariant,
  aspectRatio = '4 / 3',
  borderRadius = '16px',
  sx,
}: ResourceImageProps) {
  const [errored, setErrored] = useState(false);
  const showImage = Boolean(src) && !errored;
  const showArticleIllustration = !showImage && Boolean(articleSlug) && hasArticleIllustration(articleSlug as string);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        aspectRatio,
        borderRadius,
        overflow: 'hidden',
        backgroundColor: colors.lightBlueBg,
        flexShrink: 0,
        ...sx,
      }}
    >
      {showImage ? (
        <Box
          component="img"
          src={src ?? undefined}
          alt={alt}
          loading="lazy"
          decoding="async"
          onError={() => setErrored(true)}
          sx={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : showArticleIllustration ? (
        <ArticleTopicIllustration slug={articleSlug as string} title={alt} />
      ) : illustrationVariant ? (
        <TopicIllustration variant={illustrationVariant} title={alt} />
      ) : (
        <Box
          role="img"
          aria-label={alt}
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: `linear-gradient(135deg, ${colors.lightBlueBg} 0%, #DCEBFF 100%)`,
          }}
        >
          <Icon size={36} color={colors.primaryBlue} strokeWidth={1.6} aria-hidden />
        </Box>
      )}
    </Box>
  );
}
