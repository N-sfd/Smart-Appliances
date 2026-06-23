import React, { useState } from 'react';
import { Box, Typography, Divider, Collapse, IconButton, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { colors, fonts } from '../../theme';
import { calculateServiceEstimate, formatCurrency } from '../../utils/pricing';

export interface ServicePricingSummaryProps {
  serviceCategory?: string | null;
  productName?: string | null;
  serviceTypeLabel?: string | null;
  urgency?: string | null;
}

const TRUST_NOTES = [
  'No hidden booking fees',
  'Final price confirmed before work begins',
  'Request ID provided after booking',
];

const ServicePricingSummary: React.FC<ServicePricingSummaryProps> = ({
  serviceCategory,
  productName,
  serviceTypeLabel,
  urgency,
}) => {
  const theme = useTheme();
  const isDesktopUp = useMediaQuery(theme.breakpoints.up('md'));
  const [expanded, setExpanded] = useState(true);
  const [feeInfoExpanded, setFeeInfoExpanded] = useState(false);

  const estimate = calculateServiceEstimate({
    serviceCategory,
    productName,
    serviceType: serviceTypeLabel,
    urgency,
  });

  const cardSx = {
    backgroundColor: '#FFFFFF',
    borderRadius: '16px',
    border: `1px solid ${colors.border}`,
    boxShadow: '0 4px 16px rgba(10,37,64,0.06)',
    p: 2.5,
  };

  const headerRow = (
    <Box
      sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: { xs: 'pointer', md: 'default' } }}
      onClick={() => { if (!isDesktopUp) setExpanded((e) => !e); }}
    >
      <Typography
        sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1rem', color: colors.navy }}
      >
        Service Summary
      </Typography>
      <IconButton
        size="small"
        aria-label={expanded ? 'Collapse pricing summary' : 'Expand pricing summary'}
        aria-expanded={expanded}
        sx={{ display: { xs: 'inline-flex', md: 'none' }, transform: expanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}
        onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
      >
        <ExpandMoreIcon fontSize="small" />
      </IconButton>
    </Box>
  );

  if (!estimate) {
    return (
      <Box sx={cardSx} aria-label="Service pricing summary">
        {headerRow}
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.mutedText, mt: 1.5 }}>
          Select a service to see your starting estimate.
        </Typography>
      </Box>
    );
  }

  const showBreakdown = expanded || isDesktopUp;

  return (
    <Box sx={cardSx} aria-label="Service pricing summary">
      {headerRow}

      <Collapse in={showBreakdown} timeout="auto">
        {/* Selected service */}
        <Box sx={{ mt: 1.75, mb: 2 }}>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.75rem', color: colors.mutedText, fontWeight: 600 }}>
            {estimate.categoryLabel}{serviceTypeLabel ? ` ${serviceTypeLabel}` : ''}
          </Typography>
          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '1.05rem', color: colors.navy }}>
            {productName || `${estimate.categoryLabel} Service`}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Price breakdown */}
        <Box role="group" aria-label="Price breakdown" sx={{ display: 'grid', gap: 1, mb: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.darkText }}>
              Service Call Fee
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', fontWeight: 600, color: colors.darkText }}>
              {estimate.quoteRequired ? '—' : formatCurrency(estimate.baseFee ?? 0)}
            </Typography>
          </Box>

          {estimate.priorityFee > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.darkText }}>
                Same-Day Priority Fee
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', fontWeight: 600, color: colors.darkText }}>
                {formatCurrency(estimate.priorityFee)}
              </Typography>
            </Box>
          )}

          {estimate.emergencyFee > 0 && (
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.emergency }}>
                Emergency Fee
              </Typography>
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', fontWeight: 600, color: colors.emergency }}>
                {formatCurrency(estimate.emergencyFee)}
              </Typography>
            </Box>
          )}

          <Divider sx={{ my: 0.5 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.95rem', color: colors.navy }}>
              {estimate.quoteRequired ? 'Estimate' : 'Estimated Total'}
            </Typography>
            <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.15rem', color: colors.primaryBlue }}>
              {estimate.quoteRequired ? 'Quote required' : formatCurrency(estimate.estimatedTotal ?? 0)}
            </Typography>
          </Box>
        </Box>

        {/* Explanation */}
        <Box sx={{ p: 1.75, borderRadius: '12px', backgroundColor: colors.lightBlueBg, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 0.5 }}>
            <InfoOutlinedIcon sx={{ fontSize: 16, color: colors.primaryBlue }} />
            <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.82rem', color: colors.navy }}>
              How do service call fees work?
            </Typography>
          </Box>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: colors.darkText, lineHeight: 1.6 }}>
            {feeInfoExpanded
              ? 'A technician will review the issue in person and confirm the final price before work begins. If you move forward with the repair, the service call fee may be applied toward the total repair cost. You can also decline the repair and only pay the service call fee.'
              : 'A technician will review the issue and confirm the final price before work begins.'}
            {' '}
            <Box
              component="span"
              role="button"
              tabIndex={0}
              onClick={() => setFeeInfoExpanded((v) => !v)}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setFeeInfoExpanded((v) => !v); }}
              sx={{ color: colors.primaryBlue, fontWeight: 700, cursor: 'pointer', '&:hover': { textDecoration: 'underline' } }}
            >
              {feeInfoExpanded ? 'Show less' : 'Learn more'}
            </Box>
          </Typography>
        </Box>

        {/* Trust notes */}
        <Box sx={{ display: 'grid', gap: 0.75, mb: 2 }}>
          {TRUST_NOTES.map((note) => (
            <Box key={note} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 15, color: colors.primaryBlue, flexShrink: 0 }} />
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.8rem', color: colors.darkText }}>
                {note}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Disclaimer */}
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, lineHeight: 1.55 }}>
          Prices shown are starting estimates. Final pricing depends on diagnosis, parts, labor, accessibility, and service urgency.
        </Typography>
      </Collapse>
    </Box>
  );
};

export default ServicePricingSummary;
