import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { fonts } from '../theme';

interface LegalPageProps {
  title: string;
  children: React.ReactNode;
}

const LegalPage: React.FC<LegalPageProps> = ({ title, children }) => (
  <Box sx={{ minHeight: '50vh', backgroundColor: '#FFFFFF', py: { xs: 5, md: 8 } }}>
    <Container maxWidth="md">
      <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '2rem', color: '#0B3D91', mb: 3 }}>
        {title}
      </Typography>
      <Typography component="div" sx={{ fontFamily: fonts.body, color: '#64748B', lineHeight: 1.8, fontSize: '0.95rem' }}>
        {children}
      </Typography>
    </Container>
  </Box>
);

export const PrivacyPolicyPage: React.FC = () => (
  <LegalPage title="Privacy Policy">
    <p>
      Smart Appliances respects your privacy. Information submitted through booking forms and contact requests
      is used only to schedule service, communicate about your appointment, and improve our operations.
    </p>
    <p>
      We do not sell personal information. For questions about how your data is handled, contact us at{' '}
      <a href="mailto:service@smartappliance.com">service@smartappliance.com</a>.
    </p>
  </LegalPage>
);

export const TermsOfServicePage: React.FC = () => (
  <LegalPage title="Terms of Service">
    <p>
      By using Smart Appliances scheduling and service request features, you agree to provide accurate contact
      and service details and to be available during your selected appointment window.
    </p>
    <p>
      Pricing is discussed and confirmed before work begins. Service availability may vary by location and urgency level.
    </p>
  </LegalPage>
);

export const AccessibilityPage: React.FC = () => (
  <LegalPage title="Accessibility">
    <p>
      Smart Appliances is committed to making our website usable for all customers. If you experience difficulty
      accessing content or booking service online, please call{' '}
      <a href="tel:+18885550199">(888) 555-0199</a> or email{' '}
      <a href="mailto:service@smartappliance.com">service@smartappliance.com</a> for assistance.
    </p>
  </LegalPage>
);
