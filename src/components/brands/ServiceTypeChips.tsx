import React from 'react';
import { Box, Typography } from '@mui/material';
import { Plug, ToggleLeft, Lightbulb, Fan, Zap, PanelsTopLeft, Wifi, Cable } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { fonts } from '../../theme';
import type { IconChipItem } from '../../data/serviceCategoryPages';

const ICON_MAP: Record<string, LucideIcon> = {
  Plug,
  ToggleLeft,
  Lightbulb,
  Fan,
  Zap,
  PanelsTopLeft,
  Wifi,
  Cable,
};

interface ServiceTypeChipsProps {
  title: string;
  subtitle?: string;
  chips: IconChipItem[];
  compact?: boolean;
}

/** Non-brand service-type chips used on the electrical hub booking header. */
const ServiceTypeChips: React.FC<ServiceTypeChipsProps> = ({
  title,
  subtitle,
  chips,
  compact = true,
}) => (
  <Box sx={{ textAlign: 'center', mb: compact ? 3 : 4.5 }}>
    <Typography
      sx={{
        fontFamily: fonts.heading,
        fontWeight: 800,
        fontSize: { xs: '1.35rem', sm: '1.5rem', md: '1.85rem' },
        color: '#1A1A1A',
        mb: subtitle ? 1 : compact ? 3 : 4.5,
      }}
    >
      {title}
    </Typography>
    {subtitle && (
      <Typography
        sx={{
          fontFamily: fonts.body,
          color: '#64748B',
          fontSize: '1rem',
          lineHeight: 1.6,
          mb: compact ? 3 : 4.5,
          maxWidth: 560,
          mx: 'auto',
        }}
      >
        {subtitle}
      </Typography>
    )}
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: compact
          ? { xs: 'repeat(2, minmax(0, 1fr))', sm: 'repeat(4, minmax(0, 1fr))' }
          : { xs: 'repeat(2, minmax(0, 1fr))', md: 'repeat(4, minmax(0, 1fr))' },
        gap: compact ? { xs: 1, sm: 1.25 } : 1.5,
        justifyItems: 'stretch',
        maxWidth: 820,
        mx: 'auto',
      }}
    >
      {chips.map(({ label, iconName }) => {
        const Icon = ICON_MAP[iconName];
        return (
          <Box
            key={label}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: compact ? 0.5 : 0.75,
              px: compact ? 1.25 : 2.5,
              py: compact ? 0.625 : 1,
              borderRadius: '999px',
              border: '1px solid #DFE3E8',
              backgroundColor: '#FFFFFF',
              minWidth: 0,
            }}
          >
            {Icon && <Icon size={compact ? 14 : 18} color="#1A73E8" strokeWidth={2} />}
            <Typography
              sx={{
                fontFamily: fonts.body,
                fontWeight: 600,
                fontSize: compact ? '0.72rem' : '0.875rem',
                color: '#0B3D91',
                lineHeight: 1.25,
              }}
            >
              {label}
            </Typography>
          </Box>
        );
      })}
    </Box>
  </Box>
);

export default ServiceTypeChips;
