import type { LucideIcon } from 'lucide-react';

export interface ServiceLandingIssueCard {
  id: string;
  label: string;
  Icon: LucideIcon;
}

export interface ServiceLandingBenefit {
  Icon: LucideIcon;
  title: string;
  desc: string;
}

export interface ServiceLandingGalleryItem {
  image: string;
  label: string;
}

export interface ServiceLandingStep {
  step: string;
  title: string;
  desc: string;
}

export interface ServiceLandingTestimonial {
  name: string;
  location: string;
  rating: number;
  text: string;
}

export interface ServiceLandingFaq {
  question: string;
  answer: string;
}

export interface ServiceLandingPageConfig {
  slug: string;
  /** <title> and og:title */
  metaTitle: string;
  /** meta description and og:description */
  metaDescription: string;
  promoChip?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  ratingLabel: string;
  /** Short trust line shown under the hero rating, e.g. "Diagnostic visit from $89" */
  startingPriceLabel: string;
  /** Label for every "book now" button on the page, e.g. "Book Refrigerator Service" */
  ctaButtonLabel: string;
  issueSectionTitle: string;
  issueSectionSubtitle: string;
  issues: ServiceLandingIssueCard[];
  benefits: ServiceLandingBenefit[];
  techGalleryTitle: string;
  techGallerySubtitle: string;
  techGallery: ServiceLandingGalleryItem[];
  howItWorks: ServiceLandingStep[];
  testimonials: ServiceLandingTestimonial[];
  whatToExpectTitle: string;
  whatToExpect: string[];
  whatToExpectImage: string;
  faqs: ServiceLandingFaq[];
  ctaTitle: string;
  ctaSubtitle: string;
  /** Product name + category sent to the scheduler for prefill */
  schedulerProductName: string;
  schedulerCategory: string;
}
