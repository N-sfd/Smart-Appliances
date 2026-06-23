import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box, Typography, Container, TextField, Button, Divider, CircularProgress,
  Tab, Tabs,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import TrackChangesIcon from '@mui/icons-material/TrackChanges';
import { colors, fonts } from '../theme';
import {
  fetchBookingByRequestNumber,
  fetchBookingsByContact,
  BookingRow,
  ADMIN_STATUS_STEPS,
} from '../lib/supabaseBookings';
import { fetchExpertById } from '../services/adminExperts';

// ── Helpers ───────────────────────────────────────────────────────────────────

const formatPhone = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
};

const fmtDate = (iso?: string | null) => {
  if (!iso) return '—';
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch { return iso; }
};

const fmtTimestamp = (iso?: string | null) => {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return iso; }
};

// ── Status timeline ───────────────────────────────────────────────────────────

const StatusTimeline: React.FC<{ currentStatus: string }> = ({ currentStatus }) => {
  const steps = ADMIN_STATUS_STEPS;
  const currentIdx = steps.indexOf(currentStatus as typeof steps[number]);
  const isCancelled = currentStatus === 'Cancelled';

  return (
    <Box sx={{ mt: 2 }}>
      {isCancelled ? (
        <Box sx={{ p: 2, borderRadius: '10px', backgroundColor: '#FEF2F2', border: '1px solid #FECACA' }}>
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, color: '#DC2626', fontSize: '0.9rem' }}>
            This request has been cancelled.
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: '#7F1D1D', fontSize: '0.82rem', mt: 0.5 }}>
            Please contact us if you have questions.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
          {steps.map((step, idx) => {
            const done = idx <= currentIdx;
            const active = idx === currentIdx;
            return (
              <Box key={step} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  {done ? (
                    <CheckCircleIcon sx={{ fontSize: 20, color: active ? colors.primaryBlue : '#2E7D32', mt: 0.15 }} />
                  ) : (
                    <RadioButtonUncheckedIcon sx={{ fontSize: 20, color: colors.border, mt: 0.15 }} />
                  )}
                  {idx < steps.length - 1 && (
                    <Box sx={{ width: 2, flex: 1, minHeight: 24, backgroundColor: done ? '#2E7D32' : colors.border, my: 0.25 }} />
                  )}
                </Box>
                <Box sx={{ pb: idx < steps.length - 1 ? 1 : 0 }}>
                  <Typography sx={{
                    fontFamily: fonts.body,
                    fontSize: '0.88rem',
                    fontWeight: active ? 700 : done ? 600 : 400,
                    color: active ? colors.primaryBlue : done ? '#2E7D32' : colors.mutedText,
                    mt: 0.1,
                  }}>
                    {step}
                    {active && (
                      <Box component="span" sx={{ ml: 1, px: 1, py: 0.25, borderRadius: '6px', backgroundColor: colors.lightBlueBg, color: colors.primaryBlue, fontSize: '0.72rem', fontWeight: 700 }}>
                        Current
                      </Box>
                    )}
                  </Typography>
                </Box>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
};

// ── Result card ───────────────────────────────────────────────────────────────

const BookingCard: React.FC<{ b: BookingRow }> = ({ b }) => {
  const displayStatus = b.admin_status ?? b.status ?? 'New';
  const estimateLabel = b.quote_required
    ? 'Quote required'
    : b.estimated_total != null
      ? `$${b.estimated_total.toFixed(2)}`
      : null;
  const [assignedExpertName, setAssignedExpertName] = useState<string | null>(null);

  useEffect(() => {
    if (!b.expert_id) { setAssignedExpertName(null); return; }
    fetchExpertById(b.expert_id).then((e) => setAssignedExpertName(e?.name ?? null));
  }, [b.expert_id]);

  return (
    <Box
      sx={{
        backgroundColor: '#fff', borderRadius: '20px', p: { xs: 2.5, md: 3.5 },
        boxShadow: colors.cardShadow, border: `1px solid ${colors.border}`, mb: 2,
      }}
    >
      {/* Header row */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 1, mb: 1.5 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TrackChangesIcon sx={{ color: colors.primaryBlue, fontSize: 20 }} />
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 800, color: colors.primaryBlue, fontSize: '1rem', letterSpacing: '0.04em' }}>
            {b.request_number ?? '—'}
          </Typography>
        </Box>
        <Box sx={{ px: 1.5, py: 0.4, borderRadius: '8px', backgroundColor: colors.lightBlueBg, border: `1px solid ${colors.border}` }}>
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.78rem', color: colors.primaryBlue }}>
            {displayStatus}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Details grid */}
      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, gap: 1.5, mb: 2 }}>
        {[
          ['Service', b.service_type || '—'],
          ['Category', b.service_category || '—'],
          ...(b.product_name ? [['Product / Service', b.product_name]] : []),
          ...(b.preferred_date ? [['Preferred Date', fmtDate(b.preferred_date)]] : []),
          ...(b.preferred_time ? [['Preferred Time', b.preferred_time]] : []),
          ...(assignedExpertName ? [['Assigned Expert', assignedExpertName]] : b.expert_name ? [['Requested Expert', b.expert_name]] : []),
          ...(estimateLabel ? [['Starting Estimate', estimateLabel]] : []),
          ['Submitted', fmtTimestamp(b.created_at)],
        ].map(([label, val]) => (
          <Box key={label}>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', color: colors.mutedText, textTransform: 'uppercase', letterSpacing: '0.05em', mb: 0.25 }}>
              {label}
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.navy, fontWeight: 600 }}>
              {val}
            </Typography>
          </Box>
        ))}
      </Box>

      {estimateLabel && (
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText, mb: 2, lineHeight: 1.6 }}>
          Final pricing is confirmed after technician inspection.
        </Typography>
      )}

      {/* Customer message from admin */}
      {b.customer_message && (
        <Box sx={{ p: 2, borderRadius: '10px', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', mb: 2 }}>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.72rem', fontWeight: 700, color: colors.primaryBlue, mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Message from our team
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.navy, lineHeight: 1.6 }}>
            {b.customer_message}
          </Typography>
        </Box>
      )}

      {/* Status timeline */}
      <Box sx={{ mt: 1 }}>
        <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.82rem', color: colors.navy, mb: 1, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Status Timeline
        </Typography>
        <StatusTimeline currentStatus={displayStatus} />
      </Box>
    </Box>
  );
};

// ── Main page ─────────────────────────────────────────────────────────────────

const TrackRequestPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const prefilledId = searchParams.get('id') ?? '';

  const [tab, setTab] = useState<0 | 1>(0);
  const [requestId, setRequestId] = useState(prefilledId);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<BookingRow[]>([]);
  const [searched, setSearched] = useState(false);
  const [noResult, setNoResult] = useState(false);

  // Auto-search when prefilled from confirmation page
  useEffect(() => {
    if (prefilledId) {
      handleSearch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    setResults([]);
    setNoResult(false);
    setSearched(true);

    if (tab === 0) {
      const result = await fetchBookingByRequestNumber(requestId.trim());
      if (result) {
        setResults([result]);
      } else {
        setNoResult(true);
      }
    } else {
      const rows = await fetchBookingsByContact(email.trim(), phone);
      if (rows.length > 0) {
        setResults(rows);
      } else {
        setNoResult(true);
      }
    }
    setLoading(false);
  };

  const fieldSx = {
    '& .MuiOutlinedInput-root': { borderRadius: '12px', fontFamily: fonts.body, fontSize: '0.9rem' },
  };

  return (
    <Box sx={{ minHeight: '80vh', backgroundColor: colors.background, py: { xs: 4, md: 7 }, px: 2 }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <TrackChangesIcon sx={{ fontSize: 44, color: colors.primaryBlue, mb: 1.5 }} />
          <Typography variant="h3" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800, mb: 1, fontSize: { xs: '1.8rem', md: '2.2rem' } }}>
            Track Your Service Request
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.95rem' }}>
            Enter your request ID or contact info to see your current status.
          </Typography>
        </Box>

        {/* Search card */}
        <Box
          sx={{
            backgroundColor: '#fff', borderRadius: '20px', p: { xs: 2.5, md: 4 },
            boxShadow: colors.cardShadow, border: `1px solid ${colors.border}`, mb: 3,
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setResults([]); setSearched(false); setNoResult(false); }}
            sx={{ mb: 3, borderBottom: `1px solid ${colors.border}` }}
          >
            <Tab label="By Request ID" sx={{ fontFamily: fonts.body, fontWeight: 600, textTransform: 'none', fontSize: '0.9rem' }} />
            <Tab label="By Email & Phone" sx={{ fontFamily: fonts.body, fontWeight: 600, textTransform: 'none', fontSize: '0.9rem' }} />
          </Tabs>

          {tab === 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Request ID"
                placeholder="e.g. SA-2026-AB12CD"
                value={requestId}
                onChange={(e) => setRequestId(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                fullWidth
                sx={fieldSx}
                InputLabelProps={{ shrink: true }}
              />
            </Box>
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                sx={fieldSx}
              />
              <TextField
                label="Phone number"
                value={phone}
                onChange={(e) => setPhone(formatPhone(e.target.value))}
                inputProps={{ inputMode: 'tel' }}
                fullWidth
                sx={fieldSx}
              />
            </Box>
          )}

          <Button
            variant="contained"
            fullWidth
            onClick={handleSearch}
            disabled={loading || (tab === 0 ? !requestId.trim() : (!email.trim() || !phone.trim()))}
            startIcon={loading ? <CircularProgress size={16} sx={{ color: '#fff' }} /> : <SearchIcon />}
            sx={{
              mt: 2.5, backgroundColor: colors.primaryBlue, color: '#fff',
              fontFamily: fonts.body, fontWeight: 700, textTransform: 'none',
              borderRadius: '12px', py: 1.4, fontSize: '0.95rem',
              '&:hover': { backgroundColor: colors.navy },
              '&.Mui-disabled': { backgroundColor: '#CBD5E1', color: '#fff' },
            }}
          >
            {loading ? 'Searching…' : 'Track Request'}
          </Button>
        </Box>

        {/* Results */}
        {searched && !loading && (
          <>
            {noResult ? (
              <Box
                sx={{
                  backgroundColor: '#fff', borderRadius: '16px', p: { xs: 3, md: 4 },
                  textAlign: 'center', boxShadow: colors.cardShadow, border: `1px solid ${colors.border}`,
                }}
              >
                <Typography sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 700, mb: 1 }}>
                  No request found
                </Typography>
                <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', lineHeight: 1.7 }}>
                  We could not find a request with those details. Please check your information or{' '}
                  <Box component="a" href="/contact" sx={{ color: colors.primaryBlue, fontWeight: 700, textDecoration: 'none' }}>
                    contact support
                  </Box>.
                </Typography>
              </Box>
            ) : (
              <>
                <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.85rem', mb: 2 }}>
                  {results.length} request{results.length !== 1 ? 's' : ''} found
                </Typography>
                {results.map((b) => <BookingCard key={b.id} b={b} />)}
              </>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default TrackRequestPage;
