import { SERVICE_AREA_REGION_LABEL_SHORT } from './serviceAreas';

/** Single source of truth for contact details shown across the site (contact page, service pages, footer). */
export const CONTACT_INFO = {
  phone: '+1 (240) 576-0397',
  phoneHref: 'tel:+12405760397',
  phoneHours: 'Mon–Fri 8AM–6PM, Sat 9AM–4PM',
  email: 'service@smartappliances.co',
  emailHref: 'mailto:service@smartappliances.co',
  emailSubtext: 'We respond within 2 hours',
  address: '1101 Opal Ct, Hagerstown, MD 21740',
  addressMapUrl: 'https://www.google.com/maps/search/?api=1&query=1101+Opal+Ct+Hagerstown+MD+21740',
  addressSubtext: 'Our office location',
  coverage: `Serving ${SERVICE_AREA_REGION_LABEL_SHORT}`,
  coverageSupportingText: 'Service availability varies by ZIP code and service type.',
} as const;

export interface BusinessHoursRow {
  day: string;
  hours: string;
  isEmergency?: boolean;
}

export const BUSINESS_HOURS: BusinessHoursRow[] = [
  { day: 'Monday–Friday', hours: '8:00 AM–6:00 PM' },
  { day: 'Saturday', hours: '9:00 AM–4:00 PM' },
  { day: 'Sunday', hours: 'Closed — Emergency requests only', isEmergency: true },
];

export interface ContactServiceCategory {
  id: string;
  label: string;
}

/** Customer-facing categories for the contact inquiry form — kept in sync with the header nav. */
export const CONTACT_SERVICE_CATEGORIES: ContactServiceCategory[] = [
  { id: 'home-appliances', label: 'Appliance Care' },
  { id: 'hvac-services', label: 'HVAC Services' },
  { id: 'plumbing-services', label: 'Plumbing Services' },
  { id: 'electrical-services', label: 'Electrical Services' },
  { id: 'smart-home-setup', label: 'Smart Home' },
  { id: 'garage-door-repair', label: 'Garage Door' },
  { id: 'tv-mounting', label: 'TV Mounting' },
  { id: 'phone-repair', label: 'Phone Repair' },
  { id: 'handyman', label: 'Handyman' },
  { id: 'emergency-service', label: 'Emergency Service' },
];

/** Maps a ServiceCategoryPageConfig.slug (e.g. "hvac") to the matching contact-form category id (e.g. "hvac-services"). */
export const SERVICE_SLUG_TO_CONTACT_CATEGORY: Record<string, string> = {
  'home-appliances': 'home-appliances',
  hvac: 'hvac-services',
  plumbing: 'plumbing-services',
  electrical: 'electrical-services',
  'smart-home': 'smart-home-setup',
  'garage-door-repair': 'garage-door-repair',
  'tv-mounting': 'tv-mounting',
  'phone-repair': 'phone-repair',
  handyman: 'handyman',
};
