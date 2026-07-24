import React, { useEffect, useRef, useState } from 'react';
import { Box, ButtonBase } from '@mui/material';
import { colors, fonts } from '../theme';

export interface AnnouncementItem {
  id: string;
  text: string;
  path?: string;
}

export const desktopAnnouncementItems: AnnouncementItem[] = [
  { id: 'zip', text: '✓ Check ZIP availability', path: '/service-areas' },
  { id: 'book', text: '✓ Book service online', path: '/scheduler' },
  { id: 'track', text: '✓ Track your request', path: '/track-request' },
  { id: 'areas', text: '✓ Serving MD, VA, WV, PA, DE & DC', path: '/service-areas' },
  { id: 'expert', text: '✓ Match with an expert', path: '/contact' },
];

export const mobileAnnouncementItems: AnnouncementItem[] = [
  { id: 'zip-m', text: '✓ Check ZIP availability', path: '/service-areas' },
  { id: 'book-m', text: '✓ Book service online', path: '/scheduler' },
  { id: 'track-m', text: '✓ Track your request', path: '/track-request' },
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(
    () => typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches,
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const handleChange = () => setReduced(query.matches);
    query.addEventListener('change', handleChange);
    return () => query.removeEventListener('change', handleChange);
  }, []);

  return reduced;
}

interface AnnouncementBannerProps {
  items: AnnouncementItem[];
  variant: 'desktop' | 'mobile';
  onActivate: (item: AnnouncementItem) => void;
  intervalMs?: number;
}

const AnnouncementBanner: React.FC<AnnouncementBannerProps> = ({
  items,
  variant,
  onActivate,
  intervalMs = 4500,
}) => {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [visible, setVisible] = useState(true);
  const reducedMotion = usePrefersReducedMotion();
  const fadeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isDesktop = variant === 'desktop';
  const current = items[index % items.length];

  useEffect(() => {
    if (paused || items.length <= 1) return undefined;

    const rotate = setInterval(() => {
      if (reducedMotion) {
        setIndex((i) => (i + 1) % items.length);
        return;
      }
      setVisible(false);
      fadeTimer.current = setTimeout(() => {
        setIndex((i) => (i + 1) % items.length);
        setVisible(true);
      }, 200);
    }, intervalMs);

    return () => {
      clearInterval(rotate);
      if (fadeTimer.current) clearTimeout(fadeTimer.current);
    };
  }, [paused, reducedMotion, items.length, intervalMs]);

  const desktopWidth = 'clamp(420px, 38vw, 520px)';

  return (
    <Box
      role="group"
      aria-live="polite"
      aria-label="Announcements"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      sx={{
        display: 'inline-flex',
        justifyContent: 'center',
        maxWidth: '100%',
        width: isDesktop ? desktopWidth : '100%',
      }}
    >
      <ButtonBase
        onClick={() => current?.path && onActivate(current)}
        aria-label={current?.text}
        focusRipple
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: isDesktop ? 32 : 30,
          minHeight: isDesktop ? 32 : 30,
          px: isDesktop ? '21px' : '14px',
          borderRadius: '999px',
          backgroundColor: isDesktop ? colors.lightBlueBg : 'transparent',
          border: isDesktop ? '1px solid #C5DCFA' : 'none',
          maxWidth: '100%',
          width: isDesktop ? desktopWidth : '100%',
          boxSizing: 'border-box',
          overflow: 'hidden',
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: isDesktop ? '#DCEBFF' : 'transparent',
          },
          '&:focus-visible': {
            outline: `2px solid ${colors.primaryBlue}`,
            outlineOffset: 2,
          },
        }}
      >
        <Box
          component="span"
          sx={{
            fontFamily: fonts.body,
            fontWeight: 600,
            fontSize: isDesktop ? '12.5px' : '12px',
            lineHeight: 1.2,
            color: colors.navy,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(-3px)',
            transition: reducedMotion ? 'none' : 'opacity 200ms ease, transform 200ms ease',
          }}
        >
          {current?.text}
        </Box>
      </ButtonBase>
    </Box>
  );
};

export default AnnouncementBanner;
