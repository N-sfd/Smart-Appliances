export type OptimizedImageVariant = 'hero' | 'section' | 'card' | 'thumbnail';

const RESPONSIVE_WIDTHS = [400, 700, 1200, 1600] as const;

const DEFAULT_SIZES: Record<OptimizedImageVariant, string> = {
  hero: '(max-width: 768px) 100vw, 50vw',
  section: '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px',
  card: '(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 400px',
  thumbnail: '(max-width: 768px) 50vw, 280px',
};

const DEFAULT_ASPECT: Record<OptimizedImageVariant, string> = {
  hero: '4 / 3',
  section: '4 / 3',
  card: '16 / 10',
  thumbnail: '4 / 3',
};

const MAX_WIDTHS: Record<OptimizedImageVariant, number> = {
  hero: 1600,
  section: 1200,
  card: 700,
  thumbnail: 400,
};

/** Strip extension to get stable asset base path. */
export function getImageBasePath(src: string): string {
  return src.replace(/\.(webp|avif|jpe?g|png)$/i, '');
}

export function getAvifSrc(src: string): string {
  return `${getImageBasePath(src)}.avif`;
}

export function buildResponsiveSrcSet(src: string, variant: OptimizedImageVariant): string {
  const base = getImageBasePath(src);
  const widths = RESPONSIVE_WIDTHS.filter((w) => w <= MAX_WIDTHS[variant]);
  const parts = widths.map((w) => `${base}-${w}w.webp ${w}w`);
  parts.push(`${base}.webp ${MAX_WIDTHS[variant]}w`);
  return parts.join(', ');
}

export function getDefaultSizes(variant: OptimizedImageVariant): string {
  return DEFAULT_SIZES[variant];
}

export function getDefaultAspectRatio(variant: OptimizedImageVariant): string {
  return DEFAULT_ASPECT[variant];
}

export function getIntrinsicDimensions(variant: OptimizedImageVariant): { width: number; height: number } {
  switch (variant) {
    case 'hero':
      return { width: 1600, height: 1200 };
    case 'section':
      return { width: 1200, height: 900 };
    case 'card':
      return { width: 700, height: 438 };
    case 'thumbnail':
    default:
      return { width: 400, height: 300 };
  }
}
