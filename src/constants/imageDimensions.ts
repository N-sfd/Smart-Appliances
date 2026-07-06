/** Intrinsic dimensions for layout-stable image rendering (CLS) */
export const LOGO_BRAND_WIDTH = 410;
export const LOGO_BRAND_HEIGHT = 308;
export const LOGO_BRAND_ASPECT = LOGO_BRAND_WIDTH / LOGO_BRAND_HEIGHT;

/** Header logo display sizes (width derived from height × aspect ratio) */
export const LOGO_HEADER_HEIGHT = { xs: 88, sm: 96, md: 108, lg: 116 } as const;
export const LOGO_HEADER_WIDTH = {
  xs: Math.round(88 * LOGO_BRAND_ASPECT),
  sm: Math.round(96 * LOGO_BRAND_ASPECT),
  md: Math.round(108 * LOGO_BRAND_ASPECT),
  lg: Math.round(116 * LOGO_BRAND_ASPECT),
} as const;

/** Typical brand logo slot in marquees (width × height) */
export const BRAND_LOGO_SLOT_WIDTH = 120;
export const BRAND_LOGO_SLOT_HEIGHT = 40;
export const BRAND_LOGO_DISPLAY_HEIGHT = { xs: 32, md: 40 } as const;
export const BRAND_LOGO_DISPLAY_WIDTH = {
  xs: Math.round(32 * (BRAND_LOGO_SLOT_WIDTH / BRAND_LOGO_SLOT_HEIGHT)),
  md: Math.round(40 * (BRAND_LOGO_SLOT_WIDTH / BRAND_LOGO_SLOT_HEIGHT)),
} as const;

/** Hero LCP image intrinsic size (layout stability) */
export const HERO_TECHNICIAN_WIDTH = 1200;
export const HERO_TECHNICIAN_HEIGHT = 900;

/** Service card image area (homepage grid) */
export const SERVICE_CARD_IMAGE_WIDTH = 400;
export const SERVICE_CARD_IMAGE_HEIGHT = 180;

/** About Us — Our Mission section photo */
export const ABOUT_MISSION_IMAGE_WIDTH = 640;
export const ABOUT_MISSION_IMAGE_HEIGHT = 480;
