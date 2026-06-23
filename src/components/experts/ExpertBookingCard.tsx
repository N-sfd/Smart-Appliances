import React, { useState } from 'react';
import {
  Box, Typography, Button, Divider, TextField, FormControl, InputLabel, Select, MenuItem,
} from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import { colors, fonts } from '../../theme';
import { Expert } from '../../data/experts';
import { SchedulerServiceCategory } from '../../data/schedulerPrefill';
import { getStartingFeeLabel } from '../../utils/pricing';
import { normalizeZipInput } from '../../data/serviceAreas';
import { useNavigate } from 'react-router-dom';

type Props = {
  expert: Expert;
};

const URGENCY_OPTIONS = ['Regular', 'Same-Day', 'Emergency'];

export default function ExpertBookingCard({ expert }: Props) {
  const navigate = useNavigate();
  const [zip, setZip] = useState('');
  const [date, setDate] = useState('');
  const [serviceName, setServiceName] = useState(expert.services[0]?.name ?? '');
  const [urgency, setUrgency] = useState('Regular');

  const isTeam = expert.slug === 'smart-appliances-team';
  const startingText = getStartingFeeLabel(expert.services);
  const selectedService = expert.services.find((s) => s.name === serviceName) ?? expert.services[0];

  const serviceCategories = Array.from(
    new Set(expert.services.map((s) => s.serviceCategory).filter((c): c is SchedulerServiceCategory => Boolean(c))),
  );
  const [serviceCategory, setServiceCategory] = useState(serviceCategories[0] ?? '');

  const buildSchedulerUrl = (extra?: Record<string, string>) => {
    const params = new URLSearchParams({ expert: expert.slug });
    if (zip) params.set('zipCode', zip);
    if (date) params.set('preferredDate', date);
    if (urgency === 'Emergency') params.set('serviceType', 'E');
    if (extra) Object.entries(extra).forEach(([k, v]) => { if (v) params.set(k, v); });
    return `/scheduler?${params.toString()}`;
  };

  const handleRequestEstimate = () => navigate(buildSchedulerUrl());

  const handleBookExpert = () => navigate(buildSchedulerUrl(
    isTeam
      ? (serviceCategory ? { serviceCategory } : undefined)
      : (selectedService?.serviceCategory ? { serviceCategory: selectedService.serviceCategory } : undefined),
  ));

  const handleSecondaryAction = () => {
    if (isTeam) navigate('/contact');
    else handleRequestEstimate();
  };

  return (
    <Box
      sx={{
        position: { md: 'sticky' },
        top: { md: '136px' },
        maxHeight: { md: 'calc(100vh - 152px)' },
        overflowY: { md: 'auto' },
      }}
    >
      <Box
        sx={{
          borderRadius: '20px',
          borderTop: `4px solid ${colors.primaryBlue}`,
          boxShadow: colors.cardShadow,
          backgroundColor: '#fff',
          p: 2.75,
        }}
      >
        {isTeam ? (
          <>
            <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '13px', color: colors.mutedText, textTransform: 'uppercase', letterSpacing: '0.04em', mb: 0.25 }}>
              Starting service call
            </Typography>
            <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '18px', color: colors.navy, mb: 0.5 }}>
              From $79–$149
            </Typography>
          </>
        ) : (
          <Typography
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: '18px',
              color: colors.navy,
              mb: 0.5,
            }}
          >
            {startingText}
          </Typography>
        )}
        <Typography
          sx={{
            fontFamily: fonts.body,
            fontSize: '13px',
            color: colors.mutedText,
            mb: 2,
          }}
        >
          Service call fee shown is a starting estimate. Final price confirmed before work begins.
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 2 }}>
          <TextField
            label="ZIP code"
            value={zip}
            onChange={(e) => setZip(normalizeZipInput(e.target.value))}
            size="small"
            fullWidth
            inputProps={{ inputMode: 'numeric', maxLength: 5 }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
          <TextField
            label="Preferred date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            size="small"
            fullWidth
            InputLabelProps={{ shrink: true }}
            sx={{ '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
          />
          {isTeam ? (
            <FormControl size="small" fullWidth>
              <InputLabel>Service category</InputLabel>
              <Select
                value={serviceCategory}
                label="Service category"
                onChange={(e) => setServiceCategory(e.target.value)}
                sx={{ borderRadius: '10px' }}
              >
                {serviceCategories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))}
              </Select>
            </FormControl>
          ) : (
            <FormControl size="small" fullWidth>
              <InputLabel>Service needed</InputLabel>
              <Select
                value={serviceName}
                label="Service needed"
                onChange={(e) => setServiceName(e.target.value)}
                sx={{ borderRadius: '10px' }}
              >
                {expert.services.map((s) => (
                  <MenuItem key={s.name} value={s.name}>{s.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          <FormControl size="small" fullWidth>
            <InputLabel>Urgency</InputLabel>
            <Select
              value={urgency}
              label="Urgency"
              onChange={(e) => setUrgency(e.target.value)}
              sx={{ borderRadius: '10px' }}
            >
              {URGENCY_OPTIONS.map((u) => (
                <MenuItem key={u} value={u}>{u}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Typography
          sx={{
            fontFamily: fonts.body,
            fontSize: '13px',
            color: colors.mutedText,
            mb: 2,
          }}
        >
          Service area: {expert.serviceAreas.join(', ')}
        </Typography>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: 'grid', gap: 1.25 }}>
          <Button variant="contained" onClick={handleBookExpert}>
            {isTeam ? 'Book This Team' : 'Book This Expert'}
          </Button>

          <Button variant="outlined" onClick={handleSecondaryAction}>
            {isTeam ? 'Ask a Question' : 'Request Estimate'}
          </Button>

          <Button
            variant="outlined"
            component="a"
            href="tel:3017830977"
            startIcon={<PhoneIcon />}
          >
            Call 301-783-0977
          </Button>
        </Box>

        {expert.responseTime && (
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '12.5px',
              color: colors.mutedText,
              mt: 1.5,
              textAlign: 'center',
            }}
          >
            {expert.responseTime}
          </Typography>
        )}
      </Box>
    </Box>
  );
}
