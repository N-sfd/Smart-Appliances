import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link as RouterLink, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Chip,
  Container,
  InputAdornment,
  TextField,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { colors, fonts } from '../../theme';
import type { BrandCategoryId } from '../../data/service-brands';
import {
  BRAND_FILTER_OPTIONS,
  RESOURCES_BRANDS_CONFIG,
  filterBrands,
  getAllBrands,
  getBrandDisclaimer,
  getContactUrlForCategory,
  parseBrandCategoryParam,
} from '../../data/service-brands';
import BrandCard from './BrandCard';

const SEARCH_THRESHOLD = 30;
const INITIAL_VISIBLE_COUNT = 42;

const BrandsDirectory: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = parseBrandCategoryParam(searchParams.get('category'));
  const brandQueryParam = searchParams.get('brand') ?? '';
  const [searchQuery, setSearchQuery] = useState(brandQueryParam);
  const [activeCategory, setActiveCategory] = useState<BrandCategoryId | 'all'>(categoryParam);
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_COUNT);

  const allBrands = useMemo(() => getAllBrands(), []);
  const showSearch = allBrands.length >= SEARCH_THRESHOLD;

  useEffect(() => {
    setActiveCategory(categoryParam);
  }, [categoryParam]);

  useEffect(() => {
    setSearchQuery(brandQueryParam);
  }, [brandQueryParam]);

  // Show the first page of results again whenever the filter or search changes.
  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_COUNT);
  }, [activeCategory, searchQuery]);

  const updateParams = useCallback(
    (category: BrandCategoryId | 'all', query: string) => {
      const next = new URLSearchParams(searchParams);
      if (category === 'all') {
        next.delete('category');
      } else {
        next.set('category', category);
      }
      if (query.trim()) {
        next.set('brand', query.trim());
      } else {
        next.delete('brand');
      }
      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const handleCategoryChange = (category: BrandCategoryId | 'all') => {
    setActiveCategory(category);
    updateParams(category, searchQuery);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    updateParams(activeCategory, value);
  };

  const filteredBrands = useMemo(
    () => filterBrands(allBrands, { category: activeCategory, query: searchQuery }),
    [allBrands, activeCategory, searchQuery],
  );

  const visibleBrands = filteredBrands.slice(0, visibleCount);
  const hasMoreBrands = filteredBrands.length > visibleCount;

  const searchId = 'brands-directory-search';
  const filterLabelId = 'brands-directory-filters';

  return (
    <Box
      component="section"
      aria-labelledby="resources-brands-heading"
      sx={{
        pt: { xs: 7, md: 8.5 },
        pb: { xs: 5, md: 6 },
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #EEF0F3',
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center', mb: { xs: 3.5, md: 4.5 } }}>
          <Typography
            id="resources-brands-heading"
            component="h2"
            sx={{
              fontFamily: fonts.heading,
              fontWeight: 800,
              fontSize: { xs: '1.35rem', md: '1.65rem' },
              color: colors.navy,
              mb: 1.25,
            }}
          >
            {RESOURCES_BRANDS_CONFIG.title}
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: { xs: '0.9rem', md: '0.95rem' },
              color: colors.mutedText,
              lineHeight: 1.65,
              mb: 2,
            }}
          >
            {RESOURCES_BRANDS_CONFIG.description}
          </Typography>
          <Typography
            sx={{
              fontFamily: fonts.body,
              fontSize: '0.82rem',
              color: '#94A3B8',
              lineHeight: 1.55,
              fontStyle: 'italic',
            }}
          >
            Brand availability may vary by service type, product model, technician availability, and service area.
            Contact us to confirm support for your specific product.
          </Typography>
        </Box>

        <Box
          id={filterLabelId}
          role="group"
          aria-label="Filter brands by service category"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 1,
            mb: 3,
          }}
        >
          {BRAND_FILTER_OPTIONS.map(({ id, label }) => {
            const selected = activeCategory === id;
            return (
              <Chip
                key={id}
                label={label}
                onClick={() => handleCategoryChange(id)}
                aria-pressed={selected}
                sx={{
                  fontFamily: fonts.body,
                  fontWeight: selected ? 700 : 600,
                  fontSize: '0.8rem',
                  backgroundColor: selected ? colors.lightBlueBg : '#FFFFFF',
                  color: selected ? colors.primaryBlue : colors.navy,
                  border: `1px solid ${selected ? colors.primaryBlue : '#DCE5EF'}`,
                  '&:hover': {
                    backgroundColor: selected ? colors.lightBlueBg : '#F8FAFC',
                  },
                  '&:focus-visible': {
                    outline: `2px solid ${colors.primaryBlue}`,
                    outlineOffset: 2,
                  },
                }}
              />
            );
          })}
        </Box>

        {showSearch && (
          <Box sx={{ maxWidth: 560, mx: 'auto', mb: 3 }}>
            <TextField
              id={searchId}
              label="Search by brand name"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              fullWidth
              size="small"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: colors.mutedText, fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                  fontFamily: fonts.body,
                  backgroundColor: '#FAFBFC',
                },
                '& .MuiInputLabel-root': { fontFamily: fonts.body },
              }}
            />
          </Box>
        )}

        <Typography
          aria-live="polite"
          sx={{
            fontFamily: fonts.body,
            fontSize: '0.85rem',
            color: colors.mutedText,
            textAlign: 'center',
            mb: 3,
          }}
        >
          {filteredBrands.length} brand{filteredBrands.length === 1 ? '' : 's'}
          {activeCategory !== 'all'
            ? ` in ${BRAND_FILTER_OPTIONS.find((o) => o.id === activeCategory)?.label ?? 'category'}`
            : ''}
        </Typography>

        {filteredBrands.length > 0 ? (
          <Box
            role="list"
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(4, minmax(0, 1fr))',
                md: 'repeat(6, minmax(0, 1fr))',
              },
              gap: { xs: 1.5, md: 2.25 },
              maxWidth: 1080,
              mx: 'auto',
            }}
          >
            {visibleBrands.map((brand) => (
              <Box key={brand.id} role="listitem">
                <BrandCard brand={brand} />
              </Box>
            ))}
          </Box>
        ) : (
          <Box sx={{ textAlign: 'center', py: 6, px: 2 }}>
            <Typography
              sx={{
                fontFamily: fonts.heading,
                fontWeight: 700,
                fontSize: '1.1rem',
                color: colors.navy,
                mb: 1,
              }}
            >
              No matching brand was found.
            </Typography>
            <Typography
              sx={{
                fontFamily: fonts.body,
                fontSize: '0.9rem',
                color: colors.mutedText,
                lineHeight: 1.6,
                maxWidth: 420,
                mx: 'auto',
                mb: 2.5,
              }}
            >
              Contact us with the brand and model number so we can confirm availability.
            </Typography>
            <Button
              component={RouterLink}
              to={getContactUrlForCategory('')}
              variant="contained"
              sx={{
                backgroundColor: colors.primaryBlue,
                fontFamily: fonts.body,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '12px',
                px: 3,
                '&:hover': { backgroundColor: colors.navy },
              }}
            >
              Contact Support
            </Button>
          </Box>
        )}

        {hasMoreBrands && (
          <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 3.5 } }}>
            <Button
              onClick={() => setVisibleCount(filteredBrands.length)}
              variant="outlined"
              sx={{
                borderColor: colors.primaryBlue,
                color: colors.primaryBlue,
                fontFamily: fonts.body,
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '12px',
                px: 3,
                '&:hover': {
                  borderColor: colors.navy,
                  color: colors.navy,
                  backgroundColor: colors.lightBlueBg,
                },
              }}
            >
              View More Brands
            </Button>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: { xs: 3, md: 3.5 } }}>
          <Button
            component={RouterLink}
            to={getContactUrlForCategory('')}
            variant="outlined"
            sx={{
              borderColor: colors.primaryBlue,
              color: colors.primaryBlue,
              fontFamily: fonts.body,
              fontWeight: 700,
              textTransform: 'none',
              borderRadius: '12px',
              px: 3,
              '&:hover': {
                borderColor: colors.navy,
                color: colors.navy,
                backgroundColor: colors.lightBlueBg,
              },
            }}
          >
            Check My Brand
          </Button>
        </Box>

        <Typography
          sx={{
            fontFamily: fonts.body,
            fontSize: '0.72rem',
            color: '#64748B',
            textAlign: 'center',
            lineHeight: 1.55,
            maxWidth: 720,
            mx: 'auto',
            mt: 3.5,
          }}
        >
          {getBrandDisclaimer()}
        </Typography>
      </Container>
    </Box>
  );
};

export default BrandsDirectory;
