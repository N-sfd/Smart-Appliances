import React, { useEffect, useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box, Typography, Container, Button, Chip, CircularProgress, Divider,
} from '@mui/material';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import BuildOutlinedIcon from '@mui/icons-material/BuildOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../contexts/AuthContext';
import { fetchUserBookings, BookingRow } from '../lib/supabaseBookings';
import { colors, fonts } from '../theme';

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  New: { bg: '#E3F2FD', text: '#0B3D91' },
  Scheduled: { bg: '#E8F5E9', text: '#1B5E20' },
  'In Progress': { bg: '#FFF3E0', text: '#E65100' },
  Completed: { bg: '#E0F2F1', text: '#004D40' },
  Cancelled: { bg: '#FAFAFA', text: '#616161' },
};

const formatDate = (iso: string) => {
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
    });
  } catch {
    return iso;
  }
};

const MyBookingsPage: React.FC = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetchUserBookings(user.id).then((rows) => {
      setBookings(rows);
      setLoading(false);
    });
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <Box sx={{ minHeight: '80vh', backgroundColor: colors.background, py: { xs: 4, md: 6 } }}>
      <Container maxWidth="md">
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800, mb: 0.25 }}
            >
              My Bookings
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem' }}>
              {profile?.full_name ? `Welcome, ${profile.full_name}` : user?.email}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 1.5 }}>
            <Button
              component={RouterLink}
              to="/scheduler"
              variant="contained"
              startIcon={<AddIcon />}
              sx={{
                backgroundColor: colors.primaryBlue, color: '#fff', fontFamily: fonts.body,
                fontWeight: 700, textTransform: 'none', borderRadius: '10px', px: 2.5,
                '&:hover': { backgroundColor: colors.navy },
              }}
            >
              New Booking
            </Button>
            <Button
              onClick={handleSignOut}
              variant="outlined"
              sx={{
                borderColor: colors.border, color: colors.darkText, fontFamily: fonts.body,
                fontWeight: 600, textTransform: 'none', borderRadius: '10px',
                '&:hover': { borderColor: colors.navy },
              }}
            >
              Sign out
            </Button>
          </Box>
        </Box>

        {/* Content */}
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : bookings.length === 0 ? (
          <Box
            sx={{
              backgroundColor: '#fff', borderRadius: '20px', p: { xs: 4, md: 6 },
              textAlign: 'center', boxShadow: colors.cardShadow, border: `1px solid ${colors.border}`,
            }}
          >
            <BuildOutlinedIcon sx={{ fontSize: 56, color: colors.border, mb: 2 }} />
            <Typography
              variant="h5"
              sx={{ fontFamily: fonts.heading, color: colors.navy, mb: 1 }}
            >
              No bookings yet
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, mb: 3 }}>
              Book your first service and it will appear here.
            </Typography>
            <Button
              component={RouterLink}
              to="/scheduler"
              variant="contained"
              sx={{
                backgroundColor: colors.primaryBlue, color: '#fff', fontFamily: fonts.body,
                fontWeight: 700, textTransform: 'none', borderRadius: '12px', px: 4, py: 1.4,
                '&:hover': { backgroundColor: colors.navy },
              }}
            >
              Schedule a Service
            </Button>
          </Box>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {bookings.map((b) => {
              const statusStyle = STATUS_COLOR[b.status] ?? { bg: '#F5F5F5', text: '#333' };
              return (
                <Box
                  key={b.id}
                  sx={{
                    backgroundColor: '#fff', borderRadius: '16px', p: { xs: 2.5, md: 3 },
                    boxShadow: '0 2px 12px rgba(10,37,64,0.06)', border: `1px solid ${colors.border}`,
                    transition: 'box-shadow 0.2s',
                    '&:hover': { boxShadow: '0 8px 24px rgba(10,37,64,0.12)' },
                  }}
                >
                  {/* Top row */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5, flexWrap: 'wrap', gap: 1 }}>
                    <Typography
                      sx={{ fontFamily: fonts.heading, fontWeight: 700, color: colors.navy, fontSize: '1.05rem' }}
                    >
                      {b.service_type}
                    </Typography>
                    <Chip
                      label={b.status}
                      size="small"
                      sx={{
                        backgroundColor: statusStyle.bg, color: statusStyle.text,
                        fontFamily: fonts.body, fontWeight: 700, fontSize: '0.78rem',
                      }}
                    />
                  </Box>

                  <Typography
                    sx={{ fontFamily: fonts.body, color: colors.primaryBlue, fontWeight: 600, fontSize: '0.85rem', mb: 1.5 }}
                  >
                    {b.service_category}
                  </Typography>

                  <Divider sx={{ mb: 1.5 }} />

                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                    {b.created_at && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <CalendarTodayIcon sx={{ fontSize: 15, color: colors.mutedText }} />
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText }}>
                          Submitted {formatDate(b.created_at)}
                        </Typography>
                      </Box>
                    )}
                    {(b.zip_code || b.city) && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <LocationOnOutlinedIcon sx={{ fontSize: 15, color: colors.mutedText }} />
                        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText }}>
                          {[b.city, b.zip_code].filter(Boolean).join(', ')}
                        </Typography>
                      </Box>
                    )}
                  </Box>

                  {b.issue_description && (
                    <Typography
                      sx={{
                        fontFamily: fonts.body, fontSize: '0.82rem', color: colors.mutedText,
                        mt: 1.25, lineHeight: 1.6,
                        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      }}
                    >
                      {b.issue_description}
                    </Typography>
                  )}
                </Box>
              );
            })}
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default MyBookingsPage;
