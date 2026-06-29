import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { colors, fonts } from '../../theme';
import { isSupabaseConfigured } from '../../lib/supabaseClient';

const Row: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1.25, borderBottom: `1px solid ${colors.border}` }}>
    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', color: colors.mutedText }}>{label}</Typography>
    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', fontWeight: 600, color: colors.darkText, textAlign: 'right' }}>{value}</Typography>
  </Box>
);

const SettingsCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <Paper elevation={0} sx={{ p: 3, borderRadius: '16px', border: `1px solid ${colors.border}`, mb: 3 }}>
    <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, color: colors.navy, mb: 1 }}>{title}</Typography>
    {children}
  </Paper>
);

const AdminSettingsPage: React.FC = () => (
  <Box sx={{ p: { xs: 2, md: 4 } }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
      <SettingsOutlinedIcon sx={{ color: colors.primaryBlue, fontSize: 28 }} />
      <Typography variant="h4" sx={{ fontFamily: fonts.heading, color: colors.navy, fontWeight: 800 }}>
        Settings
      </Typography>
    </Box>
    <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText, fontSize: '0.9rem', mb: 3 }}>
      Read-only business configuration. To change these values, update the source constants and redeploy — no secrets are shown here.
    </Typography>

    <SettingsCard title="Business Contact">
      <Row label="Business Phone" value="(240) 576-0397" />
      <Row label="Support Email" value="service@smartappliances.co" />
      <Row label="Site URL" value="frabjous-queijadas-2649b4.netlify.app" />
    </SettingsCard>

    <SettingsCard title="Service Areas">
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, py: 1 }}>
        {['Maryland', 'Washington DC', 'Virginia', 'Pennsylvania', 'West Virginia'].map((area) => (
          <Chip key={area} label={area} sx={{ backgroundColor: colors.lightBlueBg, color: colors.primaryBlue, fontFamily: fonts.body, fontWeight: 600 }} />
        ))}
      </Box>
    </SettingsCard>

    <SettingsCard title="Default Pricing">
      <Row label="Service Call Fee (typical)" value="$89 – $99" />
      <Row label="Same-Day Priority Fee" value="+$25" />
      <Row label="Emergency Fee" value="+$50" />
    </SettingsCard>

    <SettingsCard title="Integrations">
      <Row
        label="Supabase Connection"
        value={
          <Chip
            label={isSupabaseConfigured() ? 'Connected' : 'Not Configured'}
            size="small"
            sx={{
              backgroundColor: isSupabaseConfigured() ? '#E8F5E9' : '#FEF2F2',
              color: isSupabaseConfigured() ? '#1B5E20' : '#DC2626',
              fontFamily: fonts.body, fontWeight: 700,
            }}
          />
        }
      />
      <Row label="Email Sender (Resend via Netlify Function)" value={<Chip label="Active" size="small" sx={{ backgroundColor: '#E8F5E9', color: '#1B5E20', fontFamily: fonts.body, fontWeight: 700 }} />} />
    </SettingsCard>
  </Box>
);

export default AdminSettingsPage;
