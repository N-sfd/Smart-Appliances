export interface ArticleRelatedVideo {
  title: string;
  description: string;
  /** YouTube video ID — omit until a reviewed, relevant, publicly embeddable video is approved. */
  youtubeId?: string;
  sourceName?: string;
}

/**
 * Topic-specific sidebar media copy for Help Center articles. No youtubeId
 * is set for any entry yet — every card renders the "coming soon" placeholder
 * until a reviewed, on-topic video is approved and added here.
 */
export const ARTICLE_RELATED_VIDEOS: Record<string, ArticleRelatedVideo> = {
  'freezer-frost-buildup': {
    title: 'How to Reduce Freezer Frost',
    description: 'Covers door seals, air circulation, temperature settings, and defrost warning signs.',
  },
  'smart-thermostat-benefits': {
    title: 'Smart Thermostat Setup Basics',
    description: 'Covers compatibility, wiring safety, app connection, and energy schedules.',
  },
  'electrical-safety-diy-or-pro': {
    title: 'Electrical Warning Signs at Home',
    description: 'Covers sparks, warm outlets, burning smells, tripping breakers, and when to stop DIY work.',
  },
  'hvac-filter-guide': {
    title: 'How to Replace an HVAC Filter',
    description: 'Covers filter direction, filter size, replacement schedule, and airflow.',
  },
  'lower-heating-bill': {
    title: 'Simple Heating Efficiency Tips',
    description: 'Covers thermostat settings, filters, drafts, and maintenance.',
  },
};

export function getArticleRelatedVideo(slug: string): ArticleRelatedVideo | undefined {
  return ARTICLE_RELATED_VIDEOS[slug];
}
