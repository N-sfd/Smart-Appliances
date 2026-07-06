import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import { colors, fonts } from '../../theme';

export interface ResourceBreadcrumbItem {
  label: string;
  path?: string;
}

interface Props {
  items: ResourceBreadcrumbItem[];
}

export default function ResourceBreadcrumbs({ items }: Props) {
  return (
    <Box component="nav" aria-label="Breadcrumb" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <Box key={item.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {index > 0 && <NavigateNextIcon sx={{ fontSize: 14, color: colors.mutedText }} />}
            {item.path && !isLast ? (
              <Typography
                component={RouterLink}
                to={item.path}
                sx={{
                  fontFamily: fonts.body,
                  fontSize: '13px',
                  color: colors.mutedText,
                  textDecoration: 'none',
                  '&:hover': { color: colors.primaryBlue },
                }}
              >
                {item.label}
              </Typography>
            ) : (
              <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.navy, fontWeight: 600 }}>
                {item.label}
              </Typography>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
