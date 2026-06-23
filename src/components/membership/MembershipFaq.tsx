import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { colors, fonts } from '../../theme';

interface FaqItem {
  q: string;
  a: string;
}

interface MembershipFaqProps {
  faqs: FaqItem[];
}

const MembershipFaq: React.FC<MembershipFaqProps> = ({ faqs }) => (
  <>
    {faqs.map((faq) => (
      <Accordion
        key={faq.q}
        disableGutters
        elevation={0}
        sx={{
          mb: 1.5,
          borderRadius: '14px !important',
          border: `1px solid ${colors.border}`,
          transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
          '&:before': { display: 'none' },
          '&:hover': { borderColor: colors.primaryBlue },
          '&.Mui-expanded': { boxShadow: '0 4px 16px rgba(10, 37, 64, 0.06)' },
        }}
      >
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 600, fontSize: '0.92rem', color: colors.navy }}>
            {faq.q}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '0.88rem', color: colors.mutedText, lineHeight: 1.7 }}>
            {faq.a}
          </Typography>
        </AccordionDetails>
      </Accordion>
    ))}
  </>
);

export default MembershipFaq;
