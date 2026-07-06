import { useEffect } from 'react';

export interface SeoFaqItem {
  question: string;
  answer: string;
}

export interface SeoServiceSchema {
  name: string;
  description: string;
  areaServed: string[];
  /** e.g. "$89" — rendered as offers.price when present */
  priceFrom?: string;
}

export interface SeoBreadcrumb {
  name: string;
  /** Site-relative path, e.g. "/resources" */
  path: string;
}

export interface SeoArticleSchema {
  headline: string;
  description: string;
  /** ISO date, e.g. "2026-03-05" */
  datePublished: string;
  dateModified?: string;
  image?: string;
}

export interface SeoOptions {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/services/refrigerator-service" */
  path: string;
  image?: string;
  faqs?: SeoFaqItem[];
  /** Adds a schema.org Service structured-data block for this page */
  service?: SeoServiceSchema;
  /** Adds a schema.org BreadcrumbList structured-data block for this page */
  breadcrumbs?: SeoBreadcrumb[];
  /** Adds a schema.org Article structured-data block for this page */
  article?: SeoArticleSchema;
}

// TODO: replace with the real production domain once a custom domain is connected (see docs/custom-domain-setup.md)
const SITE_URL = 'https://www.smartappliances.com';
const DEFAULT_OG_IMAGE = '/images/services/hero-appliance-technician.webp';

function upsertMeta(attr: 'name' | 'property', key: string, content: string): HTMLMetaElement {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
  return el;
}

function upsertLink(rel: string, href: string): HTMLLinkElement {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
  return el;
}

/**
 * Sets per-route document title, meta description, canonical link, Open Graph
 * tags, and optional FAQPage structured data — then restores the previous
 * values on unmount so the base tags in public/index.html apply everywhere else.
 */
function appendJsonLd(payload: Record<string, unknown>): HTMLScriptElement {
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.text = JSON.stringify(payload);
  document.head.appendChild(script);
  return script;
}

export function useSeo({ title, description, path, image, faqs, service, breadcrumbs, article }: SeoOptions): void {
  useEffect(() => {
    const prevTitle = document.title;
    const descriptionEl = document.head.querySelector<HTMLMetaElement>('meta[name="description"]');
    const prevDescription = descriptionEl?.getAttribute('content') ?? null;

    document.title = title;
    upsertMeta('name', 'description', description);
    upsertLink('canonical', `${SITE_URL}${path}`);
    upsertMeta('property', 'og:type', 'website');
    upsertMeta('property', 'og:title', title);
    upsertMeta('property', 'og:description', description);
    upsertMeta('property', 'og:url', `${SITE_URL}${path}`);
    upsertMeta('property', 'og:image', `${SITE_URL}${image ?? DEFAULT_OG_IMAGE}`);
    upsertMeta('name', 'twitter:card', 'summary_large_image');
    upsertMeta('name', 'twitter:title', title);
    upsertMeta('name', 'twitter:description', description);

    const scripts: HTMLScriptElement[] = [];

    if (faqs && faqs.length > 0) {
      scripts.push(appendJsonLd({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: { '@type': 'Answer', text: faq.answer },
        })),
      }));
    }

    if (service) {
      scripts.push(appendJsonLd({
        '@context': 'https://schema.org',
        '@type': 'Service',
        name: service.name,
        description: service.description,
        areaServed: service.areaServed,
        provider: { '@type': 'LocalBusiness', name: 'Smart Appliances' },
        ...(service.priceFrom ? { offers: { '@type': 'Offer', price: service.priceFrom, priceCurrency: 'USD' } } : {}),
      }));
    }

    if (breadcrumbs && breadcrumbs.length > 0) {
      scripts.push(appendJsonLd({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: breadcrumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: `${SITE_URL}${crumb.path}`,
        })),
      }));
    }

    if (article) {
      scripts.push(appendJsonLd({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.headline,
        description: article.description,
        datePublished: article.datePublished,
        dateModified: article.dateModified ?? article.datePublished,
        image: `${SITE_URL}${article.image ?? image ?? DEFAULT_OG_IMAGE}`,
        author: { '@type': 'Organization', name: 'Smart Appliances' },
        publisher: { '@type': 'Organization', name: 'Smart Appliances' },
        mainEntityOfPage: { '@type': 'WebPage', '@id': `${SITE_URL}${path}` },
      }));
    }

    return () => {
      document.title = prevTitle;
      if (prevDescription !== null) {
        upsertMeta('name', 'description', prevDescription);
      }
      scripts.forEach((s) => document.head.removeChild(s));
    };
  }, [title, description, path, image, faqs, service, breadcrumbs, article]);
}
