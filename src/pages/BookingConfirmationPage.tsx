import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Container, Button, Divider, CircularProgress,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import { colors, fonts } from '../theme';
import { fetchBookingByRequestNumber, BookingRow } from '../lib/supabaseBookings';
import type { ServiceEstimate } from '../utils/pricing';

interface ConfirmationState {
  requestNumber: string;
  customerName: string;
  service: string;
  category: string;
  preferredDate: string;
  preferredTime: string;
  estimate?: ServiceEstimate | null;
  expertName?: string | null;
}

const formatDate = (iso: string) => {
  if (!iso) return '';
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
    });
  } catch { return iso; }
};

const BookingConfirmationPage: React.FC = () => {
  const { requestNumber } = useParams<{ requestNumber: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const navState = location.state as ConfirmationState | null;

  const [booking, setBooking] = useState<BookingRow | null>(null);
  const [loading, setLoading] = useState(!navState);

  useEffect(() => {
    if (navState || !requestNumber) { setLoading(false); return; }
    fetchBookingByRequestNumber(requestNumber).then((row) => {
      setBooking(row);
      setLoading(false);
    });
  }, [requestNumber, navState]);

  const reqNum = navState?.requestNumber ?? booking?.request_number ?? requestNumber ?? '';
  const customerName = navState?.customerName ?? booking?.customer_name ?? '';
  const service = navState?.service ?? booking?.service_type ?? '';
  const category = navState?.category ?? booking?.service_category ?? '';
  const preferredDate = navState?.preferredDate ?? booking?.preferred_date ?? '';
  const preferredTime = navState?.preferredTime ?? booking?.preferred_time ?? '';
  const quoteRequired = navState?.estimate?.quoteRequired ?? booking?.quote_required ?? false;
  const estimatedTotal = navState?.estimate?.estimatedTotal ?? booking?.estimated_total ?? null;
  const estimateLabel = quoteRequired
    ? 'Estimate required'
    : estimatedTotal != null
      ? `$${estimatedTotal.toFixed(2)}`
      : null;
  const expertName = navState?.expertName ?? booking?.expert_name ?? '';

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '80vh', backgroundColor: colors.background, py: { xs: 4, md: 7 }, px: 2 }}>
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: '#fff',
            borderRadius: '24px',
            p: { xs: 3, md: 5 },
            boxShadow: colors.cardShadow,
            border: `1px solid ${colors.border}`,
            textAlign: 'center',
          }}
        >
          {/* Success icon */}
          <Box
            sx={{
              width: 80, height: 80, borderRadius: '50%',
              backgroundColor: '#E8F5E9', display: 'flex',
              alignItems: 'center', justifyContent: 'center', mx: 'auto', mb: 2.5,
            }}
          >
            <CheckCircleIcon sx={{ fontSize: 48, color: '#2E7D32' }} />
          </Box>

          <Typography
            variant="h4"
            sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800, mb: 1 }}
          >
            Request Received!
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.95rem', mb: 3, lineHeight: 1.7 }}>
            {customerName ? `Thanks, ${customerName}. ` : ''}We'll contact you shortly to confirm your appointment.
          </Typography>

          {/* Request ID badge */}
          <Box
            sx={{
              display: 'inline-flex', alignItems: 'center', gap: 1,
              px: 2.5, py: 1, borderRadius: '999px',
              backgroundColor: colors.lightBlueBg,
              border: `1.5px solid ${colors.primaryBlue}`,
              mb: 3,
            }}
          >
            <TrackChangesIcon sx={{ fontSize: 18, color: colors.primaryBlue }} />
            <Typography sx={{ fontFamily: fonts.body, fontWeight: 800, fontSize: '1rem', color: colors.primaryBlue, letterSpacing: '0.04em' }}>
              {reqNum}
            </Typography>
          </Box>

          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText, mb: 3 }}>
            Save this request ID to track your service status.
          </Typography>

          {/* Details card */}
          <Box
            sx={{
              backgroundColor: colors.background,
              borderRadius: '14px',
              border: `1px solid ${colors.border}`,
              overflow: 'hidden',
              mb: 3,
              textAlign: 'left',
            }}
          >
            {[
              ['Request ID', reqNum],
              ...(service ? [['Service', service]] : []),
              ...(category ? [['Category', category]] : []),
              ...(preferredDate ? [['Preferred Date', formatDate(preferredDate)]] : []),
              ...(preferredTime ? [['Preferred Time', preferredTime]] : []),
              ...(expertName ? [['Requested Expert', expertName]] : []),
              ...(estimateLabel ? [['Estimated Total', estimateLabel]] : []),
              ['Status', 'New — Pending review'],
            ].map(([label, value], idx, arr) => (
              <React.Fragment key={label}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', px: 2.5, py: 1.25, gap: 2 }}>
                  <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText, flexShrink: 0 }}>
                    {label}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: fonts.body, fontSize: '0.82rem',
                      color: label === 'Status' ? '#2E7D32' : colors.navy,
                      fontWeight: label === 'Status' ? 700 : 600,
                      textAlign: 'right',
                    }}
                  >
                    {value}
                  </Typography>
                </Box>
                {idx < arr.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>

          {estimateLabel && (
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText, mb: 3, lineHeight: 1.6 }}>
              Final pricing will be confirmed before work begins.
            </Typography>
          )}

          {/* Email note */}
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 3, p: 2, backgroundColor: '#FFFBEB', borderRadius: '10px', border: '1px solid #FDE68A', textAlign: 'left' }}>
            <CalendarTodayIcon sx={{ fontSize: 16, color: '#92400E', flexShrink: 0, mt: 0.3 }} />
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: '#92400E', lineHeight: 1.6 }}>
              A confirmation email has been sent to your email address. Check your inbox (and spam folder).
            </Typography>
          </Box>

          {/* Action buttons */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <Button
              component={RouterLink}
              to={`/track-request?id=${reqNum}`}
              variant="contained"
              fullWidth
              sx={{
                backgroundColor: colors.primaryBlue, color: '#fff',
                fontFamily: fonts.body, fontWeight: 700, textTransform: 'none',
                borderRadius: '12px', py: 1.4, fontSize: '0.95rem',
                '&:hover': { backgroundColor: colors.navy },
              }}
            >
              Track Request Status
            </Button>
            <Button
              component={RouterLink}
              to="/scheduler"
              variant="outlined"
              fullWidth
              sx={{
                borderColor: colors.border, color: colors.darkText,
                fontFamily: fonts.body, fontWeight: 600, textTransform: 'none',
                borderRadius: '12px', py: 1.3,
                '&:hover': { borderColor: colors.navy },
              }}
            >
              Book Another Service
            </Button>
            <Button
              onClick={() => navigate('/')}
              fullWidth
              sx={{
                color: colors.mutedText, fontFamily: fonts.body,
                fontWeight: 600, textTransform: 'none',
                '&:hover': { color: colors.navy, backgroundColor: 'transparent' },
              }}
            >
              Back to Home
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default BookingConfirmationPage;
