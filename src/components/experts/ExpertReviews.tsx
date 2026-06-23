import React from 'react';
import { Box, Typography } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { colors, fonts } from '../../theme';
import { ExpertReview } from '../../data/experts';

type Props = {
  reviews: ExpertReview[];
};

export default function ExpertReviews({ reviews }: Props) {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: fonts.heading,
          fontWeight: 800,
          fontSize: '22px',
          color: colors.navy,
          mb: 2,
        }}
      >
        Reviews
      </Typography>

      <Box
        sx={{
          mb: 2.5,
          p: 2,
          borderRadius: '12px',
          backgroundColor: '#FFFBEB',
          border: '1px solid #FDE68A',
        }}
      >
        <Typography
          sx={{
            fontFamily: fonts.body,
            fontSize: '13px',
            color: colors.darkText,
          }}
        >
          Sample review format shown for MVP. Replace with verified customer reviews after launch.
        </Typography>
      </Box>

      {reviews.map((review) => (
        <Box
          key={`${review.firstName}-${review.date}-${review.serviceType}`}
          sx={{
            borderRadius: '16px',
            border: `1px solid ${colors.border}`,
            boxShadow: colors.cardShadow,
            p: 2.5,
            mb: 2,
            backgroundColor: '#fff',
          }}
        >
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontWeight: 700,
              fontSize: '15px',
              color: colors.darkText,
              mb: 0.5,
            }}
          >
            {review.firstName}
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                sx={{
                  fontSize: 18,
                  color: i < review.rating ? colors.warningOrange : colors.border,
                }}
              />
            ))}
          </Box>

          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '12px',
              color: colors.mutedText,
              mb: 1,
            }}
          >
            {review.date} · {review.serviceType}
          </Typography>

          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '14px',
              color: colors.darkText,
            }}
          >
            {review.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
