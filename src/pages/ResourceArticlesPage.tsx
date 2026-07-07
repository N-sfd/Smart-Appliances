import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Typography, Container, TextField, Chip, InputAdornment, Button } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { colors, fonts } from '../theme';
import { useSeo } from '../hooks/useSeo';
import { RESOURCE_CATEGORIES, ResourceCategoryId } from '../data/resourceCategories';
import { RESOURCE_ARTICLES, getFeaturedArticles } from '../data/resourceArticles';
import ResourceArticleCard from '../components/resources/ResourceArticleCard';
import ResourceBreadcrumbs from '../components/resources/ResourceBreadcrumbs';
import RelatedVideoCard from '../components/resources/RelatedVideoCard';

const PAGE_SIZE = 6;

export default function ResourceArticlesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') as ResourceCategoryId | null;

  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const activeCategoryForSeo = RESOURCE_CATEGORIES.find((c) => c.id === categoryParam) ?? null;

  useSeo({
    title: activeCategoryForSeo
      ? `${activeCategoryForSeo.label} | Smart Appliances Help Center`
      : 'Appliance Care & Home Maintenance Tips | Smart Appliances',
    description: activeCategoryForSeo?.description
      ?? 'Explore appliance troubleshooting, HVAC energy-saving advice, electrical safety, plumbing maintenance, smart home guides, and garage door care.',
    path: '/resources/articles',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Help Center', path: '/resources' },
      { name: 'Articles', path: '/resources/articles' },
      ...(activeCategoryForSeo ? [{ name: activeCategoryForSeo.label, path: `/resources/articles?category=${activeCategoryForSeo.id}` }] : []),
    ],
  });

  const setCategory = (id: ResourceCategoryId | null) => {
    setVisibleCount(PAGE_SIZE);
    if (id) setSearchParams({ category: id });
    else setSearchParams({});
  };

  const featured = useMemo(() => {
    const featuredArticles = getFeaturedArticles();
    if (categoryParam) {
      return featuredArticles.find((a) => a.category === categoryParam)
        ?? RESOURCE_ARTICLES.find((a) => a.category === categoryParam);
    }
    return featuredArticles[0];
  }, [categoryParam]);

  const recentArticles = useMemo(
    () => [...RESOURCE_ARTICLES].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt)),
    [],
  );

  const filteredArticles = useMemo(() => {
    const q = search.trim().toLowerCase();
    return recentArticles.filter((article) => {
      const matchesCategory = !categoryParam || article.category === categoryParam;
      const matchesSearch = !q
        || article.title.toLowerCase().includes(q)
        || article.excerpt.toLowerCase().includes(q)
        || article.category.toLowerCase().includes(q);
      return matchesCategory && matchesSearch;
    });
  }, [recentArticles, categoryParam, search]);

  const visibleArticles = filteredArticles.slice(0, visibleCount);
  const activeCategory = RESOURCE_CATEGORIES.find((c) => c.id === categoryParam) ?? null;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Container maxWidth="lg" sx={{ pt: { xs: 3, md: 4 }, pb: { xs: 6, md: 8 } }}>
        <Box sx={{ mb: 2.5 }}>
          <ResourceBreadcrumbs
            items={[
              { label: 'Help Center', path: '/resources' },
              activeCategory ? { label: 'Articles', path: '/resources/articles' } : { label: 'Articles' },
              ...(activeCategory ? [{ label: activeCategory.label }] : []),
            ]}
          />
        </Box>

        <Typography
          component="h1"
          sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.1rem' }, color: colors.navy, mb: 1 }}
        >
          {activeCategory ? activeCategory.label : 'Help Center Articles'}
        </Typography>
        <Typography sx={{ fontFamily: fonts.body, fontSize: '0.95rem', color: colors.mutedText, mb: 3.5, maxWidth: 640 }}>
          {activeCategory
            ? activeCategory.description
            : 'Search or filter our library of original appliance, HVAC, plumbing, electrical, smart home, and garage door guides.'}
        </Typography>

        {/* SEARCH + FILTERS */}
        <Box sx={{ mb: 4 }}>
          <TextField
            placeholder="Search articles"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE); }}
            size="small"
            fullWidth
            sx={{ maxWidth: 420, mb: 2, backgroundColor: '#fff', '& .MuiOutlinedInput-root': { borderRadius: '10px' } }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 18, color: colors.mutedText }} />
                </InputAdornment>
              ),
            }}
            inputProps={{ 'aria-label': 'Search articles' }}
          />
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              label="All"
              onClick={() => setCategory(null)}
              sx={{
                fontFamily: fonts.body,
                fontWeight: !categoryParam ? 700 : 500,
                fontSize: '0.8rem',
                backgroundColor: !categoryParam ? colors.primaryBlue : colors.lightBlueBg,
                color: !categoryParam ? '#fff' : colors.primaryBlue,
                '&:hover': { backgroundColor: !categoryParam ? colors.navy : '#D9E8FB' },
              }}
            />
            {RESOURCE_CATEGORIES.map((c) => {
              const isActive = categoryParam === c.id;
              return (
                <Chip
                  key={c.id}
                  label={c.label}
                  onClick={() => setCategory(isActive ? null : c.id)}
                  sx={{
                    fontFamily: fonts.body,
                    fontWeight: isActive ? 700 : 500,
                    fontSize: '0.8rem',
                    backgroundColor: isActive ? colors.primaryBlue : colors.lightBlueBg,
                    color: isActive ? '#fff' : colors.primaryBlue,
                    '&:hover': { backgroundColor: isActive ? colors.navy : '#D9E8FB' },
                  }}
                />
              );
            })}
          </Box>
        </Box>

        {/* FEATURED ARTICLE */}
        {!search && featured && (
          <Box sx={{ mb: 5 }}>
            <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.95rem', color: colors.mutedText, mb: 1.5, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Featured Article
            </Typography>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: '1fr 300px' },
                gap: 2.5,
                alignItems: 'stretch',
              }}
            >
              <ResourceArticleCard article={featured} variant="featured" />
              {activeCategory && (
                <RelatedVideoCard
                  title={`${activeCategory.label} Video Guide`}
                  description={activeCategory.description}
                  category={activeCategory.label}
                />
              )}
            </Box>
          </Box>
        )}

        {/* ARTICLE GRID */}
        <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.95rem', color: colors.mutedText, mb: 2, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {activeCategory ? activeCategory.label : 'Recent Articles'}
        </Typography>

        {filteredArticles.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography sx={{ fontFamily: fonts.body, color: colors.mutedText }}>
              No articles found. Try another search term or category.
            </Typography>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' }, gap: 2.5, alignItems: 'stretch' }}>
              {visibleArticles.map((article) => (
                <ResourceArticleCard key={article.slug} article={article} />
              ))}
            </Box>
            {visibleCount < filteredArticles.length && (
              <Box sx={{ textAlign: 'center', mt: 4 }}>
                <Button
                  variant="outlined"
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  sx={{ borderColor: colors.border, color: colors.navy, fontFamily: fonts.body, fontWeight: 700, textTransform: 'none', borderRadius: '12px', px: 3.5, '&:hover': { borderColor: colors.primaryBlue, color: colors.primaryBlue, backgroundColor: colors.lightBlueBg } }}
                >
                  Load More
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
