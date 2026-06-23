import React from 'react';
import { Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import { colors, fonts } from '../../theme';
import {
  MEMBERSHIP_COMPARISON_FEATURES,
  MEMBERSHIP_PLANS,
  type ComparisonCell,
} from '../../data/membershipPlans';

function renderCell(value: ComparisonCell) {
  if (value === true) {
    return <CheckIcon sx={{ fontSize: 18, color: colors.primaryBlue }} aria-label="Included" />;
  }
  if (value === false) {
    return <CloseIcon sx={{ fontSize: 18, color: colors.mutedText }} aria-label="Not included" />;
  }
  return (
    <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', fontWeight: 600, color: colors.navy }}>
      {value}
    </Typography>
  );
}

const MembershipComparisonTable: React.FC = () => (
  <TableContainer
    component={Paper}
    elevation={0}
    sx={{
      borderRadius: '18px',
      border: `1px solid ${colors.border}`,
      boxShadow: '0 2px 12px rgba(10, 37, 64, 0.04)',
      overflowX: 'auto',
    }}
  >
    <Table size="small" sx={{ minWidth: 640 }}>
      <TableHead>
        <TableRow sx={{ backgroundColor: colors.lightBlueBg }}>
          <TableCell sx={{ fontFamily: fonts.heading, fontWeight: 700, color: colors.navy, borderBottom: `1px solid ${colors.border}` }}>
            Feature
          </TableCell>
          {MEMBERSHIP_PLANS.map((plan) => (
            <TableCell
              key={plan.id}
              align="center"
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 700,
                color: colors.navy,
                fontSize: '0.85rem',
                borderBottom: `1px solid ${colors.border}`,
                whiteSpace: 'nowrap',
              }}
            >
              {plan.name.replace('Smart Care ', '').replace('Whole Home Care', 'Whole Home')}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {MEMBERSHIP_COMPARISON_FEATURES.map((feature) => (
          <TableRow key={feature.id} sx={{ '&:last-child td': { borderBottom: 0 } }}>
            <TableCell
              component="th"
              scope="row"
              sx={{
                fontFamily: fonts.body,
                fontSize: '0.85rem',
                color: colors.darkText,
                maxWidth: 220,
                lineHeight: 1.5,
              }}
            >
              {feature.label}
            </TableCell>
            <TableCell align="center">{renderCell(feature.basic)}</TableCell>
            <TableCell align="center">{renderCell(feature.plus)}</TableCell>
            <TableCell align="center">{renderCell(feature.wholeHome)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export default MembershipComparisonTable;
