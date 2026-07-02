import type { SchedulerServiceCategory } from './schedulerPrefill';
import { getExpertImageUrl } from './expertImages';

export interface ExpertService {
  name: string;
  serviceCategory: SchedulerServiceCategory | null;
  isDiagnostic: boolean;
}

export interface ExpertReview {
  firstName: string;
  rating: number;
  date: string;
  serviceType: string;
  text: string;
}

export interface Expert {
  slug: string;
  name: string;
  title: string;
  category?: string;
  rating: number;
  reviewCount: number;
  jobsCompleted: string;
  responseTime?: string;
  serviceAreas: string[];
  specialties: string[];
  about: string;
  services: ExpertService[];
  reviews: ExpertReview[];
  galleryCategories: string[];
  imageUrl?: string;
  avatarUrl?: string;
  initials?: string;
  shortSummary?: string;
  /** Overrides the default "jobs completed" suffix shown next to jobsCompleted (e.g. "service requests"). */
  jobsLabel?: string;
  startingFeeLabel?: string;
}

const SERVICE_AREAS = ['Maryland', 'Washington DC', 'Virginia', 'Pennsylvania', 'West Virginia'];

export const GALLERY_CATEGORIES = [
  'Appliance Care',
  'HVAC Services',
  'Plumbing',
  'Electrical',
  'Smart Home',
  'Garage Door',
];

export const EXPERTS: Expert[] = [
  {
    slug: 'smart-appliances-team',
    name: 'Smart Appliances Team',
    title: 'Home Service Team',
    category: 'All Services',
    initials: 'SA',
    imageUrl: '/images/experts/smart-appliances-team.png',
    avatarUrl: '/images/experts/smart-appliances-team.png',
    rating: 4.9,
    reviewCount: 128,
    jobsCompleted: '750+',
    jobsLabel: 'service requests',
    startingFeeLabel: 'Service call from $89',
    shortSummary: 'Full-service home support across appliance, HVAC, plumbing, electrical, smart home, and garage door needs.',
    responseTime: 'Usually responds within 30 minutes',
    serviceAreas: SERVICE_AREAS,
    specialties: ['Appliance Care', 'HVAC Services', 'Plumbing', 'Electrical', 'Smart Home', 'Garage Door'],
    about:
      'Smart Appliances helps homeowners book appliance, HVAC, plumbing, electrical, smart home, and garage door services through a simple online request process. Customers receive a Request ID, confirmation email, and status tracking for every service request.',
    services: [
      { name: 'Refrigerator Repair', serviceCategory: 'Appliance', isDiagnostic: true },
      { name: 'AC Repair', serviceCategory: 'HVAC', isDiagnostic: true },
      { name: 'Drain Cleaning', serviceCategory: 'Plumbing', isDiagnostic: false },
      { name: 'Light Fixture Installation', serviceCategory: 'Electrical', isDiagnostic: false },
      { name: 'Smart Thermostat Installation', serviceCategory: 'Smart Home', isDiagnostic: false },
      { name: 'Garage Door Repair', serviceCategory: 'Garage Door', isDiagnostic: true },
    ],
    reviews: [
      {
        firstName: 'Jordan',
        rating: 5,
        date: 'Recently',
        serviceType: 'Appliance Repair',
        text: 'Easy booking process and clear request tracking.',
      },
      {
        firstName: 'Casey',
        rating: 5,
        date: 'Recently',
        serviceType: 'HVAC Service',
        text: 'Professional communication and helpful follow-up.',
      },
      {
        firstName: 'Morgan',
        rating: 5,
        date: 'Recently',
        serviceType: 'Plumbing',
        text: 'The service summary made it easy to understand the starting cost.',
      },
    ],
    galleryCategories: GALLERY_CATEGORIES,
  },
  {
    slug: 'hvac-repair-specialist',
    name: 'HVAC Comfort Expert',
    title: 'Heating, Cooling & Air Quality Services',
    category: 'HVAC',
    initials: 'HC',
    imageUrl: '/images/experts/hvac-comfort-expert.png',
    avatarUrl: '/images/experts/hvac-comfort-expert.png',
    rating: 4.8,
    reviewCount: 74,
    jobsCompleted: '320+',
    startingFeeLabel: 'Service call from $99',
    shortSummary: 'Heating and cooling care with clear estimates, seasonal maintenance, and emergency HVAC support when available.',
    responseTime: 'Usually responds within 1 hour',
    serviceAreas: SERVICE_AREAS,
    specialties: ['AC Service', 'Furnace Service', 'Thermostat Installation', 'HVAC Maintenance', 'Emergency HVAC Service'],
    about:
      'Focused on heating and cooling systems, this specialist diagnoses and repairs AC and furnace issues, installs thermostats, and performs seasonal maintenance to keep your system running efficiently.',
    services: [
      { name: 'AC Repair', serviceCategory: 'HVAC', isDiagnostic: true },
      { name: 'Heating / Furnace Repair', serviceCategory: 'HVAC', isDiagnostic: true },
      { name: 'Thermostat Installation', serviceCategory: 'HVAC', isDiagnostic: false },
      { name: 'HVAC Maintenance', serviceCategory: 'HVAC', isDiagnostic: false },
      { name: 'Emergency HVAC Service', serviceCategory: 'HVAC', isDiagnostic: true },
    ],
    reviews: [
      {
        firstName: 'Alex',
        rating: 5,
        date: 'Recently',
        serviceType: 'AC Repair',
        text: 'Great communication and fast response. The technician explained the issue clearly.',
      },
      {
        firstName: 'Taylor',
        rating: 5,
        date: 'Recently',
        serviceType: 'HVAC Maintenance',
        text: 'Easy booking process and I received a request ID right away.',
      },
      {
        firstName: 'Sam',
        rating: 5,
        date: 'Recently',
        serviceType: 'Furnace Repair',
        text: 'Professional service and helpful follow-up.',
      },
    ],
    galleryCategories: GALLERY_CATEGORIES,
  },
  {
    slug: 'appliance-repair-specialist',
    name: 'Appliance Care Expert',
    title: 'Kitchen & Laundry Appliance Services',
    category: 'Appliance',
    initials: 'AC',
    imageUrl: '/images/experts/appliance-care-expert.png',
    avatarUrl: '/images/experts/appliance-care-expert.png',
    rating: 4.9,
    reviewCount: 96,
    jobsCompleted: '410+',
    startingFeeLabel: 'Service call from $89',
    shortSummary: 'Trusted help for refrigerators, washers, dryers, dishwashers, ovens, and major kitchen appliances.',
    responseTime: 'Usually responds within 1 hour',
    serviceAreas: SERVICE_AREAS,
    specialties: ['Refrigerator Service', 'Washer & Dryer Service', 'Dishwasher Service', 'Oven & Stove Service', 'Microwave Service', 'Appliance Installation'],
    about:
      'Specializes in diagnosing and repairing major household appliances — refrigerators, washers, dryers, dishwashers, ovens, and microwaves — plus professional installation for new appliances.',
    services: [
      { name: 'Refrigerator Repair', serviceCategory: 'Appliance', isDiagnostic: true },
      { name: 'Washer / Dryer Repair', serviceCategory: 'Appliance', isDiagnostic: true },
      { name: 'Dishwasher Repair', serviceCategory: 'Appliance', isDiagnostic: true },
      { name: 'Oven / Stove Repair', serviceCategory: 'Appliance', isDiagnostic: true },
      { name: 'Microwave Repair', serviceCategory: 'Appliance', isDiagnostic: true },
      { name: 'Appliance Installation', serviceCategory: 'Appliance', isDiagnostic: false },
    ],
    reviews: [
      {
        firstName: 'Riley',
        rating: 5,
        date: 'Recently',
        serviceType: 'Refrigerator Repair',
        text: 'Great communication and fast response. The technician explained the issue clearly.',
      },
      {
        firstName: 'Jamie',
        rating: 5,
        date: 'Recently',
        serviceType: 'Dishwasher Repair',
        text: 'Easy booking process and I received a request ID right away.',
      },
      {
        firstName: 'Drew',
        rating: 4,
        date: 'Recently',
        serviceType: 'Oven Repair',
        text: 'Professional service and helpful follow-up.',
      },
    ],
    galleryCategories: GALLERY_CATEGORIES,
  },
  {
    slug: 'plumbing-repair-specialist',
    name: 'Plumbing Service Expert',
    title: 'Drain, Disposal, Leak & Fixture Services',
    category: 'Plumbing',
    initials: 'PS',
    imageUrl: '/images/experts/plumbing-service-expert.png',
    avatarUrl: '/images/experts/plumbing-service-expert.png',
    rating: 4.8,
    reviewCount: 61,
    jobsCompleted: '260+',
    startingFeeLabel: 'Service call from $99',
    shortSummary: 'Drain clearing, leak checks, disposal issues, and fixture service with upfront communication.',
    responseTime: 'Usually responds within 1 hour',
    serviceAreas: SERVICE_AREAS,
    specialties: ['Drain Cleaning', 'Garbage Disposal Service', 'Leak Inspection', 'Faucet Service', 'Toilet Service'],
    about:
      'Handles drain clogs, leak inspections, garbage disposal issues, faucet repairs, and toilet repairs with upfront pricing and clear communication before any work begins.',
    services: [
      { name: 'Drain Cleaning', serviceCategory: 'Plumbing', isDiagnostic: false },
      { name: 'Garbage Disposal Repair', serviceCategory: 'Plumbing', isDiagnostic: true },
      { name: 'Leak Inspection', serviceCategory: 'Plumbing', isDiagnostic: true },
      { name: 'Faucet Repair / Replacement', serviceCategory: 'Plumbing', isDiagnostic: false },
      { name: 'Toilet Repair', serviceCategory: 'Plumbing', isDiagnostic: false },
    ],
    reviews: [
      {
        firstName: 'Quinn',
        rating: 5,
        date: 'Recently',
        serviceType: 'Drain Cleaning',
        text: 'Great communication and fast response. The technician explained the issue clearly.',
      },
      {
        firstName: 'Avery',
        rating: 5,
        date: 'Recently',
        serviceType: 'Leak Inspection',
        text: 'Easy booking process and I received a request ID right away.',
      },
      {
        firstName: 'Reese',
        rating: 4,
        date: 'Recently',
        serviceType: 'Toilet Repair',
        text: 'Professional service and helpful follow-up.',
      },
    ],
    galleryCategories: GALLERY_CATEGORIES,
  },
  {
    slug: 'electrical-service-specialist',
    name: 'Electrical & Smart Home Expert',
    title: 'Electrical Installations & Connected Home Setup',
    category: 'Electrical',
    initials: 'ES',
    imageUrl: '/images/experts/electrical-smart-home-expert.png',
    avatarUrl: '/images/experts/electrical-smart-home-expert.png',
    rating: 4.8,
    reviewCount: 58,
    jobsCompleted: '240+',
    startingFeeLabel: 'Service call from $99',
    shortSummary: 'Lighting, outlets, ceiling fans, and connected home device setup with professional follow-up.',
    responseTime: 'Usually responds within 1 hour',
    serviceAreas: SERVICE_AREAS,
    specialties: [
      'Light Fixture Installation',
      'Ceiling Fan Installation',
      'Outlet & Switch Service',
      'Video Doorbell Installation',
      'Smart Thermostat Installation',
      'Security Camera Installation',
    ],
    about:
      'Licensed for electrical repairs and installations, and experienced with smart home devices — from light fixtures and ceiling fans to video doorbells, smart thermostats, and security cameras.',
    services: [
      { name: 'Light Fixture Installation', serviceCategory: 'Electrical', isDiagnostic: false },
      { name: 'Ceiling Fan Installation', serviceCategory: 'Electrical', isDiagnostic: false },
      { name: 'Outlet / Switch Repair', serviceCategory: 'Electrical', isDiagnostic: true },
      { name: 'Video Doorbell Installation', serviceCategory: 'Smart Home', isDiagnostic: false },
      { name: 'Smart Thermostat Installation', serviceCategory: 'Smart Home', isDiagnostic: false },
      { name: 'Security Camera Installation', serviceCategory: 'Smart Home', isDiagnostic: false },
    ],
    reviews: [
      {
        firstName: 'Skyler',
        rating: 5,
        date: 'Recently',
        serviceType: 'Light Fixture Installation',
        text: 'Great communication and fast response. The technician explained the issue clearly.',
      },
      {
        firstName: 'Charlie',
        rating: 5,
        date: 'Recently',
        serviceType: 'Smart Lock Installation',
        text: 'Easy booking process and I received a request ID right away.',
      },
      {
        firstName: 'Rowan',
        rating: 4,
        date: 'Recently',
        serviceType: 'Ceiling Fan Installation',
        text: 'Professional service and helpful follow-up.',
      },
    ],
    galleryCategories: GALLERY_CATEGORIES,
  },
  {
    slug: 'garage-door-specialist',
    name: 'Garage Door Expert',
    title: 'Garage Door, Opener & Sensor Services',
    category: 'Garage Door',
    initials: 'GD',
    imageUrl: '/images/experts/garage-door-expert.png',
    avatarUrl: '/images/experts/garage-door-expert.png',
    rating: 4.8,
    reviewCount: 47,
    jobsCompleted: '180+',
    startingFeeLabel: 'Service call from $99',
    shortSummary: 'Garage door repair, opener service, spring issues, and safety sensor checks for residential homes.',
    responseTime: 'Usually responds within 1 hour',
    serviceAreas: SERVICE_AREAS,
    specialties: ['Garage Door Repair', 'Opener Service', 'Spring Replacement', 'Sensor Alignment', 'Track Adjustment'],
    about:
      'Focused on garage door systems, this expert handles stuck doors, broken springs, opener failures, and sensor alignment with clear pricing before work begins.',
    services: [
      { name: 'Garage Door Repair', serviceCategory: 'Garage Door', isDiagnostic: true },
      { name: 'Garage Door Opener Repair', serviceCategory: 'Garage Door', isDiagnostic: true },
      { name: 'Spring Replacement', serviceCategory: 'Garage Door', isDiagnostic: false },
      { name: 'Sensor Alignment', serviceCategory: 'Garage Door', isDiagnostic: false },
      { name: 'Track Adjustment', serviceCategory: 'Garage Door', isDiagnostic: true },
    ],
    reviews: [
      {
        firstName: 'Blake',
        rating: 5,
        date: 'Recently',
        serviceType: 'Garage Door Repair',
        text: 'Clear communication and a fast response to our stuck garage door.',
      },
      {
        firstName: 'Harper',
        rating: 5,
        date: 'Recently',
        serviceType: 'Opener Service',
        text: 'Easy booking and helpful follow-up after the service visit.',
      },
      {
        firstName: 'Logan',
        rating: 4,
        date: 'Recently',
        serviceType: 'Spring Replacement',
        text: 'Professional service and a straightforward starting estimate.',
      },
    ],
    galleryCategories: GALLERY_CATEGORIES,
  },
];

export function getExpertBySlug(slug: string): Expert | undefined {
  const expert = EXPERTS.find((e) => e.slug === slug);
  if (!expert) return undefined;
  return {
    ...expert,
    imageUrl: getExpertImageUrl(slug, expert.imageUrl, expert.avatarUrl),
    avatarUrl: getExpertImageUrl(slug, expert.avatarUrl, expert.imageUrl),
  };
}

export function resolveExpertImages(expert: Expert): Expert {
  const imageUrl = getExpertImageUrl(expert.slug, expert.imageUrl, expert.avatarUrl);
  return { ...expert, imageUrl, avatarUrl: imageUrl };
}
