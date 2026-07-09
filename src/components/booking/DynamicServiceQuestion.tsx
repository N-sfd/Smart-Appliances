import React from 'react';
import {
  Box, Typography, TextField, FormControl, Select, MenuItem,
  FormControlLabel, Checkbox, RadioGroup, Radio, FormHelperText,
} from '@mui/material';
import type { ServiceQuestion } from '../../types/services';
import { shouldShowQuestion } from '../../utils/bookingAnswers';
import { colors, fonts, radii } from '../../theme';

interface DynamicServiceQuestionProps {
  question: ServiceQuestion;
  value: unknown;
  answers: Record<string, unknown>;
  onChange: (key: string, value: unknown) => void;
}

const fieldSx = {
  '& .MuiOutlinedInput-root': { borderRadius: radii.xl },
};

export default function DynamicServiceQuestion({
  question,
  value,
  answers,
  onChange,
}: DynamicServiceQuestionProps) {
  if (!shouldShowQuestion(question.conditional_logic ?? null, answers)) {
    return null;
  }

  const options = Array.isArray(question.options)
    ? question.options.map((o) => (typeof o === 'string' ? o : String(o)))
    : [];

  const label = (
    <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.85rem', color: colors.navy, mb: 0.75 }}>
      {question.label}
      {question.is_required ? ' *' : ''}
    </Typography>
  );

  switch (question.input_type) {
    case 'textarea':
      return (
        <Box sx={{ mb: 2 }}>
          {label}
          <TextField
            fullWidth
            multiline
            minRows={3}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(question.question_key, e.target.value)}
            placeholder={question.helper_text ?? undefined}
            sx={fieldSx}
          />
        </Box>
      );

    case 'select':
      return (
        <Box sx={{ mb: 2 }}>
          {label}
          <FormControl fullWidth size="small" sx={fieldSx}>
            <Select
              value={(value as string) ?? ''}
              displayEmpty
              onChange={(e) => onChange(question.question_key, e.target.value)}
            >
              <MenuItem value=""><em>Select…</em></MenuItem>
              {options.map((opt) => (
                <MenuItem key={opt} value={opt}>{opt}</MenuItem>
              ))}
            </Select>
            {question.helper_text ? <FormHelperText>{question.helper_text}</FormHelperText> : null}
          </FormControl>
        </Box>
      );

    case 'radio':
      return (
        <Box sx={{ mb: 2 }}>
          {label}
          <RadioGroup
            value={value === undefined || value === null ? '' : String(value)}
            onChange={(e) => onChange(question.question_key, e.target.value)}
          >
            {options.map((opt) => (
              <FormControlLabel key={opt} value={opt} control={<Radio size="small" />} label={opt} />
            ))}
          </RadioGroup>
        </Box>
      );

    case 'checkbox':
      return (
        <Box sx={{ mb: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={Boolean(value)}
                onChange={(e) => onChange(question.question_key, e.target.checked)}
              />
            }
            label={
              <Typography sx={{ fontFamily: fonts.body, fontSize: '0.85rem', fontWeight: 600 }}>
                {question.label}{question.is_required ? ' *' : ''}
              </Typography>
            }
          />
        </Box>
      );

    case 'boolean':
      return (
        <Box sx={{ mb: 2 }}>
          {label}
          <RadioGroup
            row
            value={value === true ? 'yes' : value === false ? 'no' : ''}
            onChange={(e) => onChange(question.question_key, e.target.value === 'yes')}
          >
            <FormControlLabel value="yes" control={<Radio size="small" />} label="Yes" />
            <FormControlLabel value="no" control={<Radio size="small" />} label="No" />
          </RadioGroup>
        </Box>
      );

    case 'number':
      return (
        <Box sx={{ mb: 2 }}>
          {label}
          <TextField
            fullWidth
            type="number"
            value={value === undefined || value === null ? '' : String(value)}
            onChange={(e) => onChange(question.question_key, e.target.value === '' ? '' : Number(e.target.value))}
            sx={fieldSx}
          />
        </Box>
      );

    case 'date':
    case 'time':
      return (
        <Box sx={{ mb: 2 }}>
          {label}
          <TextField
            fullWidth
            type={question.input_type}
            value={(value as string) ?? ''}
            onChange={(e) => onChange(question.question_key, e.target.value)}
            sx={fieldSx}
          />
        </Box>
      );

    default:
      return (
        <Box sx={{ mb: 2 }}>
          {label}
          <TextField
            fullWidth
            value={(value as string) ?? ''}
            onChange={(e) => onChange(question.question_key, e.target.value)}
            placeholder={question.helper_text ?? undefined}
            sx={fieldSx}
          />
        </Box>
      );
  }
}
