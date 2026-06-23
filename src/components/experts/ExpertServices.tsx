import React from 'react';
import { Box, Typography, Button, Chip } from '@mui/material';
import { colors, fonts } from '../../theme';
import { ExpertService } from '../../data/experts';
import { calculateServiceEstimate, formatCurrency } from '../../utils/pricing';
import { getServiceDisplayName } from '../../utils/serviceDisplayNames';
import { useNavigate } from 'react-router-dom';

type Props = {
  services: ExpertService[];
  expertSlug: string;
};

export default function ExpertServices({ services, expertSlug }: Props) {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: fonts.heading,
          fontWeight: 800,
          fontSize: '22px',
          color: colors.navy,
          mb: 0.5,
        }}
      >
        Services Offered
      </Typography>
      <Typography
        sx={{
          fontFamily: fonts.body,
          fontSize: '14px',
          color: colors.mutedText,
          mb: 2.5,
        }}
      >
        Choose from the most common services offered by this expert.
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
          },
          gap: 2,
        }}
      >
        {services.map((service) => {
          const estimate = calculateServiceEstimate({
            serviceCategory: service.serviceCategory,
            productName: service.name,
            serviceType: null,
            urgency: 'Regular',
          });

          const quoteRequired = !estimate || estimate.quoteRequired;
          const priceLine = quoteRequired
            ? 'Estimate required'
            : service.isDiagnostic
            ? `Service call from ${formatCurrency(estimate.baseFee ?? 0)}`
            : `Starting from ${formatCurrency(estimate.baseFee ?? 0)}`;

          return (
            <Box
              key={service.name}
              sx={{
                borderRadius: '18px',
                border: `1px solid ${colors.border}`,
                boxShadow: colors.cardShadow,
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                backgroundColor: '#fff',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 1, mb: 0.75 }}>
                <Typography
                  sx={{
                    fontFamily: fonts.body,
                    fontWeight: 700,
                    fontSize: '16px',
                    color: colors.darkText,
                  }}
                >
                  {getServiceDisplayName(service.name)}
                </Typography>
                {quoteRequired && (
                  <Chip
                    label="Estimate Required"
                    size="small"
                    sx={{ backgroundColor: '#FFF3E0', color: '#E65100', fontFamily: fonts.body, fontWeight: 700, fontSize: '10.5px', height: 22, flexShrink: 0 }}
                  />
                )}
              </Box>

              <Typography
                sx={{
                  fontFamily: fonts.body,
                  fontSize: '14px',
                  color: colors.mutedText,
                  mb: 0.5,
                }}
              >
                {priceLine}
              </Typography>

              <Typography
                sx={{
                  fontFamily: fonts.body,
                  fontSize: '12.5px',
                  color: colors.mutedText,
                  mb: 2,
                  lineHeight: 1.5,
                }}
              >
                {service.isDiagnostic
                  ? 'A technician diagnoses the issue in person before confirming the final price.'
                  : 'Upfront starting price for this service in your area.'}
              </Typography>

              <Box sx={{ flexGrow: 1 }} />

              <Button
                variant="contained"
                onClick={() => {
                  const params = new URLSearchParams({
                    serviceType: 'R',
                    serviceCategory: service.serviceCategory ?? '',
                    productName: service.name,
                    expert: expertSlug,
                  });
                  navigate(`/scheduler?${params.toString()}`);
                }}
              >
                Book
              </Button>
            </Box>
          );
        })}
      </Box>

      <Typography
        sx={{
          mt: 2.5,
          fontFamily: fonts.body,
          fontSize: '12px',
          color: colors.mutedText,
        }}
      >
        Pricing shown is a starting estimate. Final pricing depends on diagnosis, parts, labor, and service urgency.
      </Typography>
    </Box>
  );
}
