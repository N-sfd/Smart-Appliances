import { ResourceCategoryId } from './resourceCategories';

export interface ResourceVideo {
  id: string;
  title: string;
  description: string;
  category: ResourceCategoryId;
  /** YouTube video ID (not a full URL). Required once `enabled` is true. */
  youtubeId?: string;
  /** Channel or creator name, shown as attribution when the video is enabled. */
  sourceName?: string;
  /** Link to the original video on YouTube, shown as attribution when the video is enabled. */
  sourceUrl?: string;
  /** Optional local poster image shown behind the "coming soon" placeholder while the video is disabled. */
  thumbnail?: string;
  orientation?: 'landscape' | 'portrait';
  /**
   * Only videos with enabled: true are rendered. New videos should stay
   * disabled until the source has been reviewed for relevance, embeddability,
   * and proper attribution — see docs/image-assets-needed.md for the same
   * policy applied to images.
   */
  enabled: boolean;
  /** Help Center article slugs this video supports — used to surface it in an article's sidebar. */
  relatedArticleSlugs?: string[];
}

/**
 * Reviewed, approved, publicly embeddable YouTube videos from reputable
 * external sources (This Old House, Lowe's, RepairClinic.com, Ace Hardware,
 * Electrical Safety Foundation International, etc.) — not produced by or
 * affiliated with Smart Appliances. Each is attributed via sourceName/
 * sourceUrl wherever it renders. Do not enable a new video just because a
 * link was suggested somewhere; it must clearly match Smart Appliances
 * topics (appliance care, HVAC, plumbing, electrical safety, smart home,
 * garage door, or home energy savings) and come from a reputable,
 * attributable source.
 *
 * `relatedArticleSlugs` is deliberately non-overlapping across entries —
 * each Help Center article slug should map to exactly one video so
 * `getVideoForArticle` always resolves the intended sidebar video.
 */
export const RESOURCE_VIDEOS: ResourceVideo[] = [
  {
    id: 'refrigerator-maintenance',
    title: 'Refrigerator Yearly Maintenance Guide',
    description: 'Practical refrigerator maintenance, including filters, seals, coils, and frost checks.',
    category: 'appliance-care',
    youtubeId: 'WPee8a2wKvs',
    sourceName: 'Repair & Replace',
    sourceUrl: 'https://www.youtube.com/watch?v=WPee8a2wKvs',
    orientation: 'landscape',
    enabled: true,
    relatedArticleSlugs: ['freezer-frost-buildup'],
  },
  {
    id: 'refrigerator-maintenance-tips',
    title: 'Refrigerator Maintenance Tips',
    description: 'Maintenance guidance covering refrigerator gaskets, condenser coils, and efficient operation.',
    category: 'appliance-care',
    youtubeId: 'pbsPivTDz-w',
    sourceName: 'RepairClinic.com',
    sourceUrl: 'https://www.youtube.com/watch?v=pbsPivTDz-w',
    orientation: 'landscape',
    enabled: true,
    relatedArticleSlugs: ['refrigerator-not-cooling', 'appliance-repair-or-replace'],
  },
  {
    id: 'replace-home-air-filter',
    title: 'How to Replace Your Home Air Filter',
    description: 'A clear guide to choosing the correct filter size and replacing a home HVAC filter.',
    category: 'hvac-energy',
    youtubeId: 's1j7PZgZKkY',
    sourceName: "Lowe's Home Improvement",
    sourceUrl: 'https://www.youtube.com/watch?v=s1j7PZgZKkY',
    orientation: 'landscape',
    enabled: true,
    relatedArticleSlugs: ['hvac-filter-guide'],
  },
  {
    id: 'save-on-heating-bills',
    title: 'How to Save Money on Heating Bills',
    description: 'Practical steps for improving heating efficiency and reducing seasonal energy costs.',
    category: 'hvac-energy',
    youtubeId: '2-29z0yFDL4',
    sourceName: 'This Old House',
    sourceUrl: 'https://www.youtube.com/watch?v=2-29z0yFDL4',
    orientation: 'landscape',
    enabled: true,
    relatedArticleSlugs: ['lower-heating-bill'],
  },
  {
    id: 'smart-thermostat-overview',
    title: 'All About Smart Thermostats',
    description: 'An overview of smart thermostat convenience, controls, compatibility, and energy efficiency.',
    category: 'smart-home',
    youtubeId: 'IDyJ-6N207Q',
    sourceName: 'This Old House',
    sourceUrl: 'https://www.youtube.com/watch?v=IDyJ-6N207Q',
    orientation: 'landscape',
    enabled: true,
    relatedArticleSlugs: ['smart-thermostat-benefits'],
  },
  {
    id: 'prevent-plumbing-leaks',
    title: 'How to Prevent Household Plumbing Leaks',
    description: 'Common water-damage risks and practical household leak-prevention guidance.',
    category: 'plumbing',
    youtubeId: 'z_YGXXmBFV8',
    sourceName: 'This Old House',
    sourceUrl: 'https://www.youtube.com/watch?v=z_YGXXmBFV8',
    orientation: 'landscape',
    enabled: true,
    relatedArticleSlugs: ['prevent-plumbing-leaks'],
  },
  {
    id: 'home-electrical-safety',
    title: 'Home Electrical System Safety',
    description: 'An introduction to common household electrical hazards and safer homeowner practices.',
    category: 'electrical-safety',
    youtubeId: '7XA_Ukj026w',
    sourceName: 'Electrical Safety Foundation International',
    sourceUrl: 'https://www.youtube.com/watch?v=7XA_Ukj026w',
    orientation: 'landscape',
    enabled: true,
    relatedArticleSlugs: ['electrical-safety-diy-or-pro'],
  },
  {
    id: 'garage-door-yearly-maintenance',
    title: 'What to Do Yearly to Your Garage Door',
    description: 'A practical garage-door maintenance overview covering hardware, lubrication, and visual checks.',
    category: 'garage-door',
    youtubeId: 'hV-NCxHEch4',
    sourceName: 'Ace Hardware',
    sourceUrl: 'https://www.youtube.com/watch?v=hV-NCxHEch4',
    orientation: 'landscape',
    enabled: true,
    relatedArticleSlugs: ['garage-door-maintenance'],
  },
];

export function getEnabledVideos(): ResourceVideo[] {
  return RESOURCE_VIDEOS.filter((v) => v.enabled && v.youtubeId);
}

export function getEnabledVideosByCategory(category: ResourceCategoryId): ResourceVideo[] {
  return getEnabledVideos().filter((v) => v.category === category);
}

/** First enabled, embeddable video that supports a given Help Center article, if any. */
export function getVideoForArticle(slug: string): ResourceVideo | undefined {
  return getEnabledVideos().find((v) => v.relatedArticleSlugs?.includes(slug));
}
