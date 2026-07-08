/**
 * Not imported or rendered anywhere. Organizational reference only, so a
 * new image path never gets reused across an unrelated section by
 * accident — see docs/image-assets-needed.md for the full policy and
 * per-section detail behind each path below.
 */
export const usedImageGroups: Record<string, string[]> = {
  services: [
    'public/images/services/**/*.{webp,jpg,png}',
    'public/images/services/menu/*.webp (header Services menu — vector badges until real photos are added)',
  ],
  resources: ['public/images/resources/*.webp (falls back to TopicIllustration per category)'],
  membership: ['HeroIllustration variant="membership" (vector, no file)'],
  pricing: ['HeroIllustration variant="pricing" (vector, no file)'],
  about: [
    'public/images/services/hero-technician.jpg (Our Mission photo)',
    'HeroIllustration variant="about" (hero, vector, no file)',
  ],
  contact: ['HeroIllustration variant="contact" (hero, vector, no file)'],
  experts: ['public/images/experts/*.png (unique portrait per expert, no shared faces)'],
};
