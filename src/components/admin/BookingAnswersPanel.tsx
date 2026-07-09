import React from 'react';
import { Box, Typography } from '@mui/material';
import { formatAnswerValue, formatQuestionLabel } from '../../utils/bookingAnswers';
import { colors, fonts } from '../../theme';

interface BookingAnswersPanelProps {
  answers?: Record<string, unknown> | null;
}

export default function BookingAnswersPanel({ answers }: BookingAnswersPanelProps) {
  if (!answers || Object.keys(answers).length === 0) return null;

  const entries = Object.entries(answers).filter(
    ([, value]) => value !== undefined && value !== null && value !== '',
  );

  if (entries.length === 0) return null;

  return (
    <Box sx={{ mb: 2, p: 1.5, backgroundColor: '#fff', borderRadius: '8px', border: `1px solid ${colors.border}` }}>
      <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Booking Details
      </Typography>
      <Box sx={{ display: 'grid', gap: 0.75 }}>
        {entries.map(([key, value]) => (
          <Box key={key} sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '160px 1fr' }, gap: 0.5 }}>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', fontWeight: 700, color: colors.navy }}>
              {formatQuestionLabel(key)}
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.darkText, lineHeight: 1.5 }}>
              {formatAnswerValue(value)}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
