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
          mb: 1,
          borderRadius: '12px !important',
          border: `1px solid ${colors.border}`,
          '&:before': { display: 'none' },
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
