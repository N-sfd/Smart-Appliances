import React from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { Box, Typography, Container, Button } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { ClipboardList } from 'lucide-react';
import { colors, fonts } from '../theme';
import { useSeo } from '../hooks/useSeo';
import { getResourceArticle, getRelatedArticles, GENERAL_DISCLAIMER } from '../data/resourceArticles';
import { getResourceCategory } from '../data/resourceCategories';
import ResourceImage from '../components/resources/ResourceImage';
import ResourceBreadcrumbs from '../components/resources/ResourceBreadcrumbs';
import ResourceArticleCard from '../components/resources/ResourceArticleCard';
import ResourceServiceCta from '../components/resources/ResourceServiceCta';
import ArticleInlineImage from '../components/resources/ArticleInlineImage';

const formatDate = (iso: string): string =>
  new Date(`${iso}T00:00:00`).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

const slugifyHeading = (heading: string): string =>
  heading.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export default function ResourceArticleDetailPage() {
  const { articleSlug } = useParams<{ articleSlug: string }>();
  const article = getResourceArticle(articleSlug ?? '');

  const category = article ? getResourceCategory(article.category) : undefined;
  const relatedArticles = article ? getRelatedArticles(article) : [];

  useSeo({
    title: article ? `${article.title} | Smart Appliances Help Center` : 'Article Not Found | Smart Appliances',
    description: article?.excerpt ?? 'This help center article could not be found.',
    path: `/resources/${articleSlug ?? ''}`,
    image: article?.image,
    breadcrumbs: article
      ? [
        { name: 'Home', path: '/' },
        { name: 'Help Center', path: '/resources' },
        { name: article.title, path: `/resources/${article.slug}` },
      ]
      : undefined,
    article: article
      ? {
        headline: article.title,
        description: article.excerpt,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt ?? article.publishedAt,
        image: article.image,
      }
      : undefined,
  });

  if (!article) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC' }}>
        <Container maxWidth="sm">
          <Box sx={{ borderRadius: '18px', boxShadow: colors.cardShadow, backgroundColor: '#fff', p: 3, textAlign: 'center' }}>
            <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '22px', color: colors.navy, mb: 1 }}>
              Article not found
            </Typography>
            <Typography sx={{ fontFamily: fonts.body, fontSize: '14px', color: colors.mutedText, mb: 2 }}>
              The article you&apos;re looking for isn&apos;t available. Browse the Help Center to find what you need.
            </Typography>
            <Button variant="contained" component={RouterLink} to="/resources">
              Visit the Help Center
            </Button>
          </Box>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
        <Box sx={{ mb: 2.5 }}>
          <ResourceBreadcrumbs
            items={[
              { label: 'Help Center', path: '/resources' },
              { label: 'Articles', path: '/resources/articles' },
              { label: article.title },
            ]}
          />
        </Box>

        {/* HERO */}
        <Box sx={{ mb: 3 }}>
          {category && (
            <Box
              component={RouterLink}
              to={`/resources/articles?category=${category.id}`}
              sx={{
                display: 'inline-block',
                mb: 1.5,
                px: 1.5,
                py: 0.5,
                borderRadius: '8px',
                backgroundColor: colors.lightBlueBg,
                color: colors.primaryBlue,
                fontFamily: fonts.body,
                fontWeight: 700,
                fontSize: '12px',
                textDecoration: 'none',
              }}
            >
              {category.label}
            </Box>
          )}
          <Typography component="h1" sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: { xs: '1.75rem', md: '2.15rem' }, color: colors.navy, lineHeight: 1.2, mb: 1.5 }}>
            {article.title}
          </Typography>
          <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', fontWeight: 700, color: colors.navy, mb: 0.75 }}>
            By Smart Appliances Editorial Team
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <AccessTimeIcon sx={{ fontSize: 15, color: colors.mutedText }} />
              <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.mutedText }}>{article.readingTime}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: colors.mutedText }} />
              <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.mutedText }}>Published {formatDate(article.publishedAt)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CalendarTodayIcon sx={{ fontSize: 14, color: colors.mutedText }} />
              <Typography sx={{ fontFamily: fonts.body, fontSize: '13px', color: colors.mutedText }}>Updated {formatDate(article.updatedAt ?? article.publishedAt)}</Typography>
            </Box>
          </Box>
        </Box>

        <ResourceImage
          src={article.image}
          alt={article.imageAlt}
          icon={category?.icon ?? ClipboardList}
          articleSlug={article.slug}
          illustrationVariant={article.category}
          aspectRatio="16 / 8"
          borderRadius="18px"
          sx={{ mb: 3.5 }}
        />

        {article.safetyNotice && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1.25,
              p: 2,
              mb: 3.5,
              borderRadius: '14px',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FCA5A5',
            }}
          >
            <WarningAmberIcon sx={{ color: '#DC2626', fontSize: 22, mt: '2px', flexShrink: 0 }} />
            <Typography sx={{ fontFamily: fonts.body, fontSize: '13.5px', color: '#7F1D1D', lineHeight: 1.6, fontWeight: 600 }}>
              {article.safetyNotice}
            </Typography>
          </Box>
        )}

        <Typography sx={{ fontFamily: fonts.body, fontSize: '15.5px', color: colors.darkText, lineHeight: 1.75, mb: 3.5 }}>
          {article.intro}
        </Typography>

        {/* TABLE OF CONTENTS */}
        <Box sx={{ mb: 4, p: 2.25, borderRadius: '14px', backgroundColor: '#fff', border: `1px solid ${colors.border}` }}>
          <Typography sx={{ fontFamily: fonts.heading, fontWeight: 700, fontSize: '0.85rem', color: colors.navy, mb: 1, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
            In this guide
          </Typography>
          <Box component="ol" sx={{ m: 0, pl: 2.5 }}>
            {article.sections.map((section) => (
              <Box component="li" key={section.heading} sx={{ mb: 0.5 }}>
                <Typography
                  component="a"
                  href={`#${slugifyHeading(section.heading)}`}
                  sx={{ fontFamily: fonts.body, fontSize: '13.5px', color: colors.primaryBlue, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}
                >
                  {section.heading}
                </Typography>
              </Box>
            ))}
            <Box component="li">
              <Typography component="a" href="#when-to-call-a-professional" sx={{ fontFamily: fonts.body, fontSize: '13.5px', color: colors.primaryBlue, textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                When to Call a Professional
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* SECTIONS */}
        {article.sections.map((section, index) => (
          <React.Fragment key={section.heading}>
            <Box component="section" id={slugifyHeading(section.heading)} sx={{ mb: 3.5, scrollMarginTop: '96px' }}>
              <Typography component="h2" sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.2rem', color: colors.navy, mb: 1.25 }}>
                {section.heading}
              </Typography>
              {section.paragraphs.map((p, i) => (
                <Typography key={i} sx={{ fontFamily: fonts.body, fontSize: '14.5px', color: colors.darkText, lineHeight: 1.75, mb: 1.25 }}>
                  {p}
                </Typography>
              ))}
              {section.bullets && (
                <Box sx={{ mt: 1 }}>
                  {section.bullets.map((bullet) => (
                    <Box key={bullet} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.75 }}>
                      <CheckCircleIcon sx={{ color: colors.primaryBlue, fontSize: 17, mt: '2px', flexShrink: 0 }} />
                      <Typography sx={{ fontFamily: fonts.body, fontSize: '14px', color: colors.darkText, lineHeight: 1.6 }}>
                        {bullet}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </Box>
            {index === 0 && (
              <ArticleInlineImage
                variant="inspection"
                align="right"
                alt={`Closely inspecting the issue described in ${article.title}`}
                caption="A closer, careful look is often all it takes to confirm what's really going on."
              />
            )}
            {index === Math.floor((article.sections.length - 1) / 2) && article.sections.length > 2 && (
              <ArticleInlineImage
                variant="decision"
                align="left"
                alt="Homeowner deciding whether to continue or call a professional"
                caption="Still unsure? It's always fine to have a professional confirm what you're seeing before you continue."
              />
            )}
          </React.Fragment>
        ))}

        {/* WHEN TO CALL A PROFESSIONAL */}
        <Box
          component="section"
          id="when-to-call-a-professional"
          sx={{ mb: 4, p: 2.5, borderRadius: '16px', backgroundColor: colors.lightBlueBg, border: `1px solid ${colors.border}`, scrollMarginTop: '96px' }}
        >
          <Typography component="h2" sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.1rem', color: colors.navy, mb: 1.5 }}>
            When to Call a Professional
          </Typography>
          {article.whenToCallPro.map((item) => (
            <Box key={item} sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 0.75 }}>
              <WarningAmberIcon sx={{ color: colors.warningOrange, fontSize: 17, mt: '2px', flexShrink: 0 }} />
              <Typography sx={{ fontFamily: fonts.body, fontSize: '14px', color: colors.darkText, lineHeight: 1.6 }}>
                {item}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* CTA */}
        <Box sx={{ mb: 5 }}>
          <ResourceServiceCta article={article} />
        </Box>

        {/* RELATED ARTICLES */}
        {relatedArticles.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography sx={{ fontFamily: fonts.heading, fontWeight: 800, fontSize: '1.2rem', color: colors.navy, mb: 2 }}>
              Related articles
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: `repeat(${relatedArticles.length}, 1fr)` }, gap: 2 }}>
              {relatedArticles.map((related) => (
                <ResourceArticleCard key={related.slug} article={related} />
              ))}
            </Box>
          </Box>
        )}

        {/* DISCLAIMER */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, p: 2, borderRadius: '12px', backgroundColor: '#F1F5F9' }}>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: colors.mutedText, mt: '2px', flexShrink: 0 }} />
          <Typography sx={{ fontFamily: fonts.body, fontSize: '12px', color: colors.mutedText, lineHeight: 1.6 }}>
            {GENERAL_DISCLAIMER}
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
