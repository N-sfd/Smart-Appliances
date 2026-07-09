import React, { useEffect, useMemo, useState } from 'react';
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, CircularProgress } from '@mui/material';
import type { ServiceCatalogItem, ServiceQuestion } from '../../types/services';
import {
  getCategoryBySlug,
  getServicesByCategorySlug,
  loadCatalogQuestions,
} from '../../services/serviceCatalog';
import DynamicServiceQuestion from './DynamicServiceQuestion';
import { colors, fonts, radii } from '../../theme';

export interface CatalogBookingFieldsProps {
  categorySlug: string;
  /** Pre-selected service slug from URL */
  initialServiceSlug?: string;
  answers: Record<string, unknown>;
  onAnswersChange: (answers: Record<string, unknown>) => void;
  selectedService: ServiceCatalogItem | null;
  onServiceChange: (service: ServiceCatalogItem | null) => void;
  showServicePicker?: boolean;
}

export default function CatalogBookingFields({
  categorySlug,
  initialServiceSlug,
  answers,
  onAnswersChange,
  selectedService,
  onServiceChange,
  showServicePicker = true,
}: CatalogBookingFieldsProps) {
  const [services, setServices] = useState<ServiceCatalogItem[]>([]);
  const [questions, setQuestions] = useState<ServiceQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryId, setCategoryId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const cat = await getCategoryBySlug(categorySlug);
      if (cancelled) return;
      setCategoryId(cat?.id ?? null);
      const svcList = await getServicesByCategorySlug(categorySlug);
      if (cancelled) return;
      setServices(svcList);
      if (initialServiceSlug && !selectedService) {
        const match = svcList.find((s) => s.slug === initialServiceSlug);
        if (match) onServiceChange(match);
      }
      setLoading(false);
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categorySlug, initialServiceSlug]);

  useEffect(() => {
    if (!categoryId) return;
    let cancelled = false;
    (async () => {
      const qs = await loadCatalogQuestions(categoryId, selectedService?.id ?? null);
      if (!cancelled) setQuestions(qs);
    })();
    return () => { cancelled = true; };
  }, [categoryId, selectedService?.id]);

  const visibleQuestions = useMemo(() => questions, [questions]);

  const handleAnswerChange = (key: string, value: unknown) => {
    onAnswersChange({ ...answers, [key]: value });
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
        <CircularProgress size={28} />
      </Box>
    );
  }

  return (
    <Box>
      {showServicePicker && services.length > 0 ? (
        <Box sx={{ mb: 2.5 }}>
          <Typography sx={{ fontFamily: fonts.body, fontWeight: 700, fontSize: '0.85rem', color: colors.navy, mb: 0.75 }}>
            Select service *
          </Typography>
          <FormControl fullWidth size="small" sx={{ '& .MuiOutlinedInput-root': { borderRadius: radii.xl } }}>
            <InputLabel id="catalog-service-label">Service</InputLabel>
            <Select
              labelId="catalog-service-label"
              label="Service"
              value={selectedService?.id ?? ''}
              onChange={(e) => {
                const svc = services.find((s) => s.id === e.target.value) ?? null;
                onServiceChange(svc);
              }}
            >
              <MenuItem value=""><em>Choose a service…</em></MenuItem>
              {services.map((s) => (
                <MenuItem key={s.id} value={s.id}>
                  {s.name}
                  {s.starting_price != null ? ` — from $${s.starting_price}` : ''}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedService?.short_description ? (
            <Typography sx={{ fontFamily: fonts.body, fontSize: '0.78rem', color: colors.mutedText, mt: 0.75 }}>
              {selectedService.short_description}
            </Typography>
          ) : null}
        </Box>
      ) : null}

      {visibleQuestions.map((q) => (
        <DynamicServiceQuestion
          key={q.id}
          question={q}
          value={answers[q.question_key]}
          answers={answers}
          onChange={handleAnswerChange}
        />
      ))}
    </Box>
  );
}
