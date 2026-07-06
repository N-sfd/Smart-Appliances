import React from 'react';
import { Box, Typography } from '@mui/material';
import { colors, fonts } from '../../theme';
import ArticleSupportIllustration, { ArticleSupportVariant } from '../illustrations/ArticleSupportIllustration';

interface ArticleInlineImageProps {
  variant: ArticleSupportVariant;
  alt: string;
  caption: string;
  align?: 'left' | 'right';
}

/** Side-by-side supporting image + caption block used inside Help Center article bodies. */
export default function ArticleInlineImage({ variant, alt, caption, align = 'right' }: ArticleInlineImageProps) {
  const imageFirst = align === 'left';
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: imageFirst ? 'row' : 'row-reverse' },
        gap: 2,
        alignItems: 'center',
        p: 2,
        mb: 3.5,
        borderRadius: '16px',
        border: `1px solid ${colors.border}`,
        backgroundColor: '#fff',
        boxShadow: '0 4px 16px rgba(10,37,64,0.05)',
      }}
    >
      <Box sx={{ width: { xs: '100%', sm: '42%' }, flexShrink: 0, borderRadius: '12px', overflow: 'hidden', aspectRatio: '16 / 11' }}>
        <ArticleSupportIllustration variant={variant} title={alt} />
      </Box>
      <Typography sx={{ fontFamily: fonts.body, fontSize: '13.5px', color: colors.mutedText, lineHeight: 1.65, fontStyle: 'italic' }}>
        {caption}
      </Typography>
    </Box>
  );
}
