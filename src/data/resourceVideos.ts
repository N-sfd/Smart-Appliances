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
  orientation?: 'landscape' | 'portrait';
  /**
   * Only videos with enabled: true are rendered. New videos should stay
   * disabled until the source has been reviewed for relevance, embeddability,
   * and proper attribution — see docs/image-assets-needed.md for the same
   * policy applied to images.
   */
  enabled: boolean;
}

/**
 * Sample topic placeholders only — none are enabled yet. Add a reviewed,
 * relevant, publicly embeddable YouTube video by filling in youtubeId,
 * sourceName, and sourceUrl, then flipping enabled to true. Do not enable a
 * video just because a link was suggested somewhere; it must clearly match
 * Smart Appliances topics (appliance care, HVAC, plumbing, electrical
 * safety, smart home, garage door, or home energy savings) and come from a
 * reputable, attributable source.
 */
export const RESOURCE_VIDEOS: ResourceVideo[] = [
  {
    id: 'refrigerator-maintenance-basics',
    title: 'Appliance Maintenance Video',
    description: 'Refrigerator maintenance basics — coming soon.',
    category: 'appliance-care',
    orientation: 'landscape',
    enabled: false,
  },
  {
    id: 'dryer-vent-safety',
    title: 'Home Service Tutorial',
    description: 'Dryer vent safety — coming soon.',
    category: 'appliance-care',
    orientation: 'landscape',
    enabled: false,
  },
  {
    id: 'hvac-filter-replacement',
    title: 'Home Service Tutorial',
    description: 'HVAC filter replacement — coming soon.',
    category: 'hvac-energy',
    orientation: 'landscape',
    enabled: false,
  },
  {
    id: 'electrical-warning-signs',
    title: 'Safety and Maintenance Guide',
    description: 'Electrical warning signs — coming soon.',
    category: 'electrical-safety',
    orientation: 'landscape',
    enabled: false,
  },
  {
    id: 'preventing-plumbing-leaks',
    title: 'Home Service Tutorial',
    description: 'Preventing plumbing leaks — coming soon.',
    category: 'plumbing',
    orientation: 'landscape',
    enabled: false,
  },
  {
    id: 'garage-door-maintenance-video',
    title: 'Home Service Tutorial',
    description: 'Garage door maintenance — coming soon.',
    category: 'garage-door',
    orientation: 'landscape',
    enabled: false,
  },
  {
    id: 'smart-thermostat-setup',
    title: 'Home Service Tutorial',
    description: 'Smart thermostat setup — coming soon.',
    category: 'smart-home',
    orientation: 'portrait',
    enabled: false,
  },
];

export function getEnabledVideos(): ResourceVideo[] {
  return RESOURCE_VIDEOS.filter((v) => v.enabled && v.youtubeId);
}

export function getEnabledVideosByCategory(category: ResourceCategoryId): ResourceVideo[] {
  return getEnabledVideos().filter((v) => v.category === category);
}
